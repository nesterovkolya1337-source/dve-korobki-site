param(
  [string]$RepoName = "dve-korobki-site",
  [ValidateSet("public","private")]
  [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"

function Fail([string]$Message) {
  Write-Host ""
  Write-Host $Message -ForegroundColor Red
  exit 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Fail "Git is not installed. Install GitHub Desktop or Git for Windows."
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "GitHub CLI is not installed." -ForegroundColor Yellow
  Write-Host "Install it with: winget install --id GitHub.cli"
  Write-Host "Then run this script again."
  exit 1
}

try {
  gh auth status 2>$null | Out-Null
} catch {
  Write-Host "Opening GitHub authentication..." -ForegroundColor Cyan
  gh auth login --web --git-protocol https
}

$Owner = (gh api user --jq .login).Trim()
if (-not $Owner) { Fail "Could not determine authenticated GitHub user." }

if (-not (Test-Path ".git")) {
  git init -b main
  git config user.name $Owner
  $email = (gh api user --jq .email 2>$null)
  if (-not $email -or $email -eq "null") { $email = "$Owner@users.noreply.github.com" }
  git config user.email $email
  git add .
  git commit -m "chore: initialize Figma-to-preview production pipeline"
}

$FullName = "$Owner/$RepoName"
$RepoExists = $true
try { gh repo view $FullName --json name 2>$null | Out-Null } catch { $RepoExists = $false }

if (-not $RepoExists) {
  Write-Host "Creating $FullName..." -ForegroundColor Cyan
  if ($Visibility -eq "public") {
    gh repo create $FullName --public --source . --remote origin --push
  } else {
    gh repo create $FullName --private --source . --remote origin --push
  }
} else {
  Write-Host "Repository already exists: $FullName" -ForegroundColor Yellow
  if (-not (git remote get-url origin 2>$null)) {
    git remote add origin "https://github.com/$FullName.git"
  }
  git push -u origin main
}

try {
  gh api --method POST "repos/$FullName/pages" -f build_type=workflow 2>$null | Out-Null
  Write-Host "GitHub Pages enabled." -ForegroundColor Green
} catch {
  Write-Host "Pages may already be enabled. If preview does not appear, select GitHub Actions in Settings -> Pages." -ForegroundColor Yellow
}

$Preview = "https://$Owner.github.io/$RepoName/"
Write-Host ""
Write-Host "Repository: https://github.com/$FullName" -ForegroundColor Green
Write-Host "Preview (after Actions completes): $Preview" -ForegroundColor Green
Write-Host "Actions: https://github.com/$FullName/actions"
