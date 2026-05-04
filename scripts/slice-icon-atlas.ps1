param(
  [Parameter(Mandatory = $true)][string]$InputImage,
  [Parameter(Mandatory = $true)][string]$GroupJson,
  [Parameter(Mandatory = $true)][string]$OutputDir,
  [switch]$UseRelativePath
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$code = @'
using System;
using System.Drawing;
using System.Collections.Generic;
using System.Linq;

public class SliceRect {
  public int X { get; set; }
  public int Y { get; set; }
  public int Width { get; set; }
  public int Height { get; set; }
  public SliceRect() {}
  public SliceRect(int x, int y, int width, int height) {
    X = x; Y = y; Width = width; Height = height;
  }
}

public static class AtlasSlicer {
  static bool IsForeground(Color c) {
    if (c.A < 16) return false;

    int max = Math.Max(c.R, Math.Max(c.G, c.B));
    int min = Math.Min(c.R, Math.Min(c.G, c.B));
    int saturation = max - min;
    double luma = 0.2126 * c.R + 0.7152 * c.G + 0.0722 * c.B;
    bool goldFrame = c.R > 75 && c.G > 45 && c.B < 95 && c.G > c.B + 12;

    return goldFrame || luma > 55 || (saturation > 38 && luma > 32);
  }

  static int[] Smooth(int[] values, int radius) {
    var smoothed = new int[values.Length];
    for (int i = 0; i < values.Length; i++) {
      int sum = 0;
      int count = 0;
      for (int j = Math.Max(0, i - radius); j <= Math.Min(values.Length - 1, i + radius); j++) {
        sum += values[j];
        count++;
      }
      smoothed[i] = sum / Math.Max(1, count);
    }
    return smoothed;
  }

  static List<int[]> FindSegments(int[] scores, int threshold, int minLength) {
    var segments = new List<int[]>();
    bool inside = false;
    int start = 0;
    for (int i = 0; i < scores.Length; i++) {
      if (!inside && scores[i] > threshold) {
        inside = true;
        start = i;
      } else if (inside && scores[i] <= threshold) {
        if (i - start >= minLength) {
          segments.Add(new[] { start, i - 1 });
        }
        inside = false;
      }
    }
    if (inside && scores.Length - start >= minLength) {
      segments.Add(new[] { start, scores.Length - 1 });
    }
    return segments;
  }

  static List<int[]> DetectRowSegments(Bitmap bitmap, double ratio) {
    var scores = new int[bitmap.Height];
    for (int y = 0; y < bitmap.Height; y++) {
      int rowCount = 0;
      for (int x = 0; x < bitmap.Width; x++) {
        if (IsForeground(bitmap.GetPixel(x, y))) {
          rowCount++;
        }
      }
      scores[y] = rowCount;
    }
    scores = Smooth(scores, 3);
    int threshold = Math.Max(8, (int)(scores.Max() * ratio));
    return FindSegments(scores, threshold, 30);
  }

  static List<int[]> DetectColumnSegments(Bitmap bitmap, int startY, int endY, double ratio) {
    var scores = new int[bitmap.Width];
    for (int x = 0; x < bitmap.Width; x++) {
      int colCount = 0;
      for (int y = startY; y <= endY; y++) {
        if (IsForeground(bitmap.GetPixel(x, y))) {
          colCount++;
        }
      }
      scores[x] = colCount;
    }
    scores = Smooth(scores, 3);
    int threshold = Math.Max(4, (int)(scores.Max() * ratio));
    return FindSegments(scores, threshold, 30);
  }

  static int MedianSpan(IEnumerable<int[]> segments) {
    var widths = segments.Select(s => s[1] - s[0] + 1).OrderBy(v => v).ToArray();
    if (widths.Length == 0) return 0;
    return widths[widths.Length / 2];
  }

  static List<int[]> NormalizeRowColumns(List<int[]> columns, int expected, int imageWidth) {
    if (columns.Count == expected) {
      return columns;
    }

    var median = MedianSpan(columns);
    if (median <= 0) {
      throw new InvalidOperationException("Unable to determine median column span.");
    }

    while (columns.Count < expected) {
      int widestIndex = 0;
      int widest = 0;
      for (int i = 0; i < columns.Count; i++) {
        int width = columns[i][1] - columns[i][0] + 1;
        if (width > widest) {
          widest = width;
          widestIndex = i;
        }
      }

      if (widest < median * 1.35) {
        throw new InvalidOperationException("Detected fewer columns than expected.");
      }

      int needed = expected - columns.Count;
      int parts = Math.Min(needed + 1, Math.Max(2, (int)Math.Round((double)widest / median)));
      var current = columns[widestIndex];
      int partWidth = widest / parts;
      var split = new List<int[]>();
      for (int part = 0; part < parts; part++) {
        int partStart = current[0] + part * partWidth;
        int partEnd = (part == parts - 1) ? current[1] : (partStart + partWidth - 1);
        split.Add(new[] { partStart, partEnd });
      }
      columns.RemoveAt(widestIndex);
      columns.InsertRange(widestIndex, split);
    }

    if (columns.Count == expected) {
      return columns;
    }

    while (columns.Count > expected) {
      columns.RemoveAt(columns.Count - 1);
    }

    return columns;

  }

  static bool SplitWidestColumn(List<int[]> columns) {
    if (columns.Count == 0) {
      return false;
    }

    int median = MedianSpan(columns);
    if (median <= 0) {
      return false;
    }

    int widestIndex = 0;
    int widest = 0;
    for (int i = 0; i < columns.Count; i++) {
      int width = columns[i][1] - columns[i][0] + 1;
      if (width > widest) {
        widest = width;
        widestIndex = i;
      }
    }

    if (widest < median * 1.35) {
      return false;
    }

    int parts = Math.Max(2, (int)Math.Round((double)widest / median));
    var current = columns[widestIndex];
    int partWidth = widest / parts;
    var split = new List<int[]>();
    for (int part = 0; part < parts; part++) {
      int partStart = current[0] + part * partWidth;
      int partEnd = (part == parts - 1) ? current[1] : (partStart + partWidth - 1);
      split.Add(new[] { partStart, partEnd });
    }
    columns.RemoveAt(widestIndex);
    columns.InsertRange(widestIndex, split);
    return true;
  }

  static List<int[]> PadRows(List<int[]> rows, int expectedRows) {
    if (rows.Count == expectedRows) {
      return rows;
    }
    if (rows.Count > expectedRows) {
      throw new InvalidOperationException("Detected more rows than expected.");
    }
    throw new InvalidOperationException("Detected fewer rows than expected.");
  }

  public static List<SliceRect> Detect(Bitmap bitmap, int columns, int rows, int itemCount) {
    var rowSegments = PadRows(DetectRowSegments(bitmap, 0.08), rows);
    var rowColumns = new List<List<int[]>>();
    foreach (var rowSegment in rowSegments) {
      rowColumns.Add(DetectColumnSegments(bitmap, rowSegment[0], rowSegment[1], 0.08));
    }

    int totalColumns = rowColumns.Sum(cols => cols.Count);
    while (totalColumns < itemCount) {
      bool split = false;
      foreach (var columnsInRow in rowColumns.Where(cols => cols.Count < columns).OrderBy(cols => cols.Count).ToList()) {
        if (SplitWidestColumn(columnsInRow)) {
          totalColumns = rowColumns.Sum(cols => cols.Count);
          split = true;
          break;
        }
      }
      if (!split) {
        throw new InvalidOperationException("Detected fewer columns than expected.");
      }
    }

    var rects = new List<SliceRect>();
    for (int rowIndex = 0; rowIndex < rowSegments.Count; rowIndex++) {
      var rowSegment = rowSegments[rowIndex];
      var columnsInRow = rowColumns[rowIndex];
      foreach (var colSegment in columnsInRow) {
        if (rects.Count >= itemCount) {
          break;
        }
        rects.Add(new SliceRect(
          colSegment[0],
          rowSegment[0],
          colSegment[1] - colSegment[0] + 1,
          rowSegment[1] - rowSegment[0] + 1
        ));
      }
    }
    return rects;
  }

  public static List<SliceRect> UniformGrid(Bitmap bitmap, int columns, int rows, int marginX, int marginY, int gutterX, int gutterY, int? fixedCellWidth, int? fixedCellHeight) {
    int cellWidth;
    int cellHeight;

    if (fixedCellWidth.HasValue && fixedCellHeight.HasValue) {
      cellWidth = fixedCellWidth.Value;
      cellHeight = fixedCellHeight.Value;
    } else {
      cellWidth = (bitmap.Width - marginX * 2 - gutterX * (columns - 1)) / columns;
      cellHeight = (bitmap.Height - marginY * 2 - gutterY * (rows - 1)) / rows;
    }

    var rects = new List<SliceRect>();
    for (int row = 0; row < rows; row++) {
      for (int col = 0; col < columns; col++) {
        int x = marginX + col * (cellWidth + gutterX);
        int y = marginY + row * (cellHeight + gutterY);
        rects.Add(new SliceRect(x, y, cellWidth, cellHeight));
      }
    }
    return rects;
  }
}
'@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

$groupText = [System.IO.File]::ReadAllText($GroupJson, [System.Text.Encoding]::UTF8)
$group = $groupText | ConvertFrom-Json
$bitmap = New-Object System.Drawing.Bitmap($InputImage)

try {
  $columns = [int]$group.columns
  $rows = [int]$group.rows

  if ($group.fixedCellWidth -and $group.fixedCellHeight) {
    $marginX = if ($null -ne $group.marginX) { [int]$group.marginX } else { 0 }
    $marginY = if ($null -ne $group.marginY) { [int]$group.marginY } else { 0 }
    $gutterX = if ($null -ne $group.gutterX) { [int]$group.gutterX } else { 0 }
    $gutterY = if ($null -ne $group.gutterY) { [int]$group.gutterY } else { 0 }
    $rects = [AtlasSlicer]::UniformGrid($bitmap, $columns, $rows, $marginX, $marginY, $gutterX, $gutterY, [int]$group.fixedCellWidth, [int]$group.fixedCellHeight)
  } elseif ($group.marginX -or $group.marginY -or $group.gutterX -or $group.gutterY) {
    $marginX = if ($null -ne $group.marginX) { [int]$group.marginX } else { 0 }
    $marginY = if ($null -ne $group.marginY) { [int]$group.marginY } else { 0 }
    $gutterX = if ($null -ne $group.gutterX) { [int]$group.gutterX } else { 0 }
    $gutterY = if ($null -ne $group.gutterY) { [int]$group.gutterY } else { 0 }
    $rects = [AtlasSlicer]::UniformGrid($bitmap, $columns, $rows, $marginX, $marginY, $gutterX, $gutterY, $null, $null)
  } else {
    $rects = [AtlasSlicer]::Detect($bitmap, $columns, $rows, $group.items.Count)
  }

  if ($rects.Count -lt $group.items.Count) {
    throw "Detected only $($rects.Count) slices for $($group.items.Count) items."
  }

  New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

  for ($index = 0; $index -lt $group.items.Count; $index++) {
    $item = $group.items[$index]
    $rectSpec = $rects[$index]
    $rect = New-Object System.Drawing.Rectangle($rectSpec.X, $rectSpec.Y, $rectSpec.Width, $rectSpec.Height)
    $clone = $bitmap.Clone($rect, $bitmap.PixelFormat)

    try {
      if ($UseRelativePath -and $item.relativePath) {
        $dest = Join-Path $OutputDir $item.relativePath
        $destDir = Split-Path -Parent $dest
        New-Item -ItemType Directory -Force -Path $destDir | Out-Null
      } else {
        $dest = Join-Path $OutputDir $item.filename
      }
      $clone.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Output ("{0} <- x={1} y={2} w={3} h={4}" -f $dest, $rectSpec.X, $rectSpec.Y, $rectSpec.Width, $rectSpec.Height)
    } finally {
      $clone.Dispose()
    }
  }
} finally {
  $bitmap.Dispose()
}
