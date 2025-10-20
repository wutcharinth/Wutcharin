# PowerShell Script to delete old repositories
# WARNING: This is irreversible! Review before running.

Write-Host "⚠️  WARNING: This will permanently delete the following repositories:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  - wutcharinthatan.me"
Write-Host "  - splitbill-ai-b40ffd6b"
Write-Host "  - FFTT"
Write-Host "  - Data-Science--Cheat-Sheet"
Write-Host "  - basic-dataset"
Write-Host "  - Python-Tutorials"
Write-Host "  - seaborn"
Write-Host "  - pandas"
Write-Host "  - ds_2561_2"
Write-Host "  - Pandas-exercises"
Write-Host "  - Hands-On-Data-Science-and-Python-Machine-Learning"
Write-Host "  - Data-Science-45min-Intros"
Write-Host ""

$confirm = Read-Host "Are you sure you want to continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "Deletion cancelled." -ForegroundColor Green
    exit
}

Write-Host ""
Write-Host "Deleting repositories..." -ForegroundColor Cyan
Write-Host ""

# Delete each repository
gh repo delete wutcharinth/wutcharinthatan.me --yes
gh repo delete wutcharinth/splitbill-ai-b40ffd6b --yes
gh repo delete wutcharinth/FFTT --yes
gh repo delete wutcharinth/Data-Science--Cheat-Sheet --yes
gh repo delete wutcharinth/basic-dataset --yes
gh repo delete wutcharinth/Python-Tutorials --yes
gh repo delete wutcharinth/seaborn --yes
gh repo delete wutcharinth/pandas --yes
gh repo delete wutcharinth/ds_2561_2 --yes
gh repo delete wutcharinth/Pandas-exercises --yes
gh repo delete wutcharinth/Hands-On-Data-Science-and-Python-Machine-Learning --yes
gh repo delete wutcharinth/Data-Science-45min-Intros --yes

Write-Host ""
Write-Host "✅ All repositories deleted successfully!" -ForegroundColor Green

