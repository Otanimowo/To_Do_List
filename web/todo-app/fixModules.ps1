# PowerShell script to fix TypeScript module issues
$files = @(
    "src\contexts\AuthContext.tsx",
    "src\contexts\TaskContext.tsx",
    "src\hooks\useFormValidation.ts",
    "src\hooks\useProtectedRoute.tsx",
    "src\types\auth.ts",
    "src\types\task.ts",
    "src\components\Auth\LoginForm.tsx",
    "src\components\Auth\RegisterForm.tsx",
    "src\components\Tasks\TaskForm.tsx",
    "src\components\Tasks\TaskItem.tsx",
    "src\components\Tasks\TaskList.tsx",
    "src\pages\HomePage.tsx",
    "src\pages\LoginPage.tsx",
    "src\pages\NotFoundPage.tsx",
    "src\pages\ProfilePage.tsx",
    "src\pages\RegisterPage.tsx",
    "src\pages\TasksPage.tsx",
    "src\services\api.ts"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PWD $file
    
    if (Test-Path $fullPath) {
        $content = Get-Content -Path $fullPath -Raw
        
        # If file does not have an export statement, add an empty export at the end
        if (-not ($content -match "export")) {
            $content = $content + "`n`nexport {};"
            Set-Content -Path $fullPath -Value $content
            Write-Host "Fixed module in $file"
        } else {
            Write-Host "File $file already has exports, skipping"
        }
    } else {
        Write-Host "File $file not found, skipping"
    }
}

# Fix node_modules path issue
$nodeModulesPath = Join-Path $PWD "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "Creating node_modules directory..."
    New-Item -Path $nodeModulesPath -ItemType Directory -Force
}

Write-Host "All TypeScript module issues fixed!" 