# Renomme les fichiers image pour supprimer les espaces et met à jour index.html
# Usage: Ouvrir PowerShell, se placer dans le dossier du projet puis lancer :
#   .\scripts\fix-image-names.ps1

Set-Location -Path (Join-Path $PSScriptRoot "..")

$map = @{
    "image\jus sserif.jpeg"       = "jus-sserif.jpeg";
    "image\jus aicha.jpeg"        = "jus-aicha.jpeg";
    "image\Makup copie.jpg"       = "makup-copie.jpg";
    "image\nourou copie.jpg"      = "nourou-copie.jpg";
    "image\Alzo Boss 1.jpg"       = "alzo-boss-1.jpg";
    "image\Alzo Boss 2.jpg"       = "alzo-boss-2.jpg";
    "image\Save the Date 1.jpg"   = "save-the-date-1.jpg";
    "image\Plan de travail 3.jpg" = "plan-de-travail-3.jpg";
}

foreach ($old in $map.Keys) {
    if (Test-Path $old) {
        try {
            Rename-Item -Path $old -NewName $map[$old] -Force -ErrorAction Stop
            Write-Output "Renommé: $old -> $($map[$old])"
        } catch {
            Write-Output "Erreur en renommant $old : $_"
        }
    } else {
        Write-Output "Non trouvé: $old"
    }
}

# Met à jour index.html : remplace les noms encodés (%20) par les nouveaux noms
$index = "index.html"
if (Test-Path $index) {
    $content = Get-Content $index -Raw -Encoding UTF8
    foreach ($entry in $map.GetEnumerator()) {
        $fileName = [System.IO.Path]::GetFileName($entry.Key)
        $encoded = [System.Uri]::EscapeDataString($fileName)
        $newName = $entry.Value
        $content = $content -replace [regex]::Escape($encoded), [regex]::Escape($newName)
    }
    Set-Content -Path $index -Value $content -Encoding UTF8
    Write-Output "index.html mis à jour"
} else {
    Write-Output "index.html introuvable dans le répertoire courant"
}

Write-Output "Terminé. Vérifiez les changements puis committez (git add/commit/push)."