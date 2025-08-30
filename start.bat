@echo off
echo.
echo ========================================
echo 🏭 Hydrogen Factory Simulation
echo ========================================
echo.

echo ✅ Dependencies are now loaded via CDN!
echo    No npm installation required.
echo.

echo 📁 Checking file structure...
if exist "client\index.html" (
    echo ✅ Found client/index.html
    echo.
    echo 🌐 Opening simulation in browser...
    start "" "client\index.html"
) else (
    echo ❌ Error: client/index.html not found!
    echo.
    echo 📍 Current directory: %CD%
    echo.
    echo 🔍 Available files and directories:
    dir /b
    echo.
    echo 🔍 Looking in client directory:
    if exist "client" (
        dir /b "client"
    ) else (
        echo ❌ client directory not found
    )
    echo.
    echo 💡 Try running this batch file from the project root directory
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo 📋 Alternative Launch Methods
echo ========================================
echo.
echo If you encounter issues, try these methods:
echo.
echo 1️⃣ Python HTTP Server:
echo    python -m http.server 8000
echo    Then open: http://localhost:8000/client/index.html
echo.
echo 2️⃣ VS Code Live Server:
echo    Install "Live Server" extension
echo    Right-click client/index.html → "Open with Live Server"
echo.
echo 3️⃣ Direct File Opening:
echo    Navigate to client/index.html and open in browser
echo.
echo ========================================
echo 💡 Tips
echo ========================================
echo.
echo • This is a client-side only version for testing
echo • 3D graphics require WebGL support
echo • For full functionality, set up the Node.js backend
echo • Check browser console for any error messages
echo.
echo ========================================
echo 🎯 Current Status: READY TO TEST
echo ========================================
echo.
pause
