Add-Type -AssemblyName System.Drawing
$culture = [System.Globalization.CultureInfo]::InvariantCulture
function Format-Coordinate([single]$number) { return $number.ToString('0.##', $culture) }
$family = [System.Drawing.FontFamily]::new('Georgia')
$pieces = [System.Collections.Generic.List[string]]::new()
$advance = 0.0
foreach ($letter in 'Nadorly'.ToCharArray()) {
    $outline = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $outline.AddString([string]$letter, $family, [int][System.Drawing.FontStyle]::Bold, 100, [System.Drawing.PointF]::new(0,0), [System.Drawing.StringFormat]::GenericTypographic)
    $bounds = $outline.GetBounds()
    $points = $outline.PathPoints
    $types = $outline.PathTypes
    $commands = [System.Collections.Generic.List[string]]::new()
    for ($i = 0; $i -lt $points.Length; $i++) {
        $kind = $types[$i] -band 7
        $x = Format-Coordinate $points[$i].X
        $y = Format-Coordinate $points[$i].Y
        if ($kind -eq 0) { $commands.Add("M$x $y") }
        elseif ($kind -eq 1) { $commands.Add("L$x $y") }
        elseif ($kind -eq 3) {
            $x2 = Format-Coordinate $points[$i+1].X
            $y2 = Format-Coordinate $points[$i+1].Y
            $x3 = Format-Coordinate $points[$i+2].X
            $y3 = Format-Coordinate $points[$i+2].Y
            $commands.Add("C$x $y $x2 $y2 $x3 $y3")
            $i += 2
        }
        if (($types[$i] -band 128) -ne 0) { $commands.Add('Z') }
    }
    $offset = ($advance - $bounds.X).ToString('0.##', $culture)
    $pieces.Add('<path transform="translate(' + $offset + ' 0)" d="' + ($commands -join ' ') + '"/>')
    $advance += $bounds.Width + 4
    $outline.Dispose()
}
$width = [Math]::Ceiling($advance * 1.6 + 64)
$art = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + $width + ' 256" role="img" aria-labelledby="title"><title id="title">Nadorly - warm editorial wordmark</title><g fill="#111111" transform="translate(32 38) scale(1.6)">' + ($pieces -join '') + '</g></svg>'
[System.IO.File]::WriteAllText((Join-Path $PSScriptRoot 'c-v1-wordmark.svg'), $art)
$family.Dispose()
