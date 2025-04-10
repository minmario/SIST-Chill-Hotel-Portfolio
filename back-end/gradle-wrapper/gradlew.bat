@echo off
REM ----------------------------------------------------------------------------
REM Gradle start up script for Windows
REM ----------------------------------------------------------------------------

setlocal
set JAVA_EXE=java

if not "%JAVA_HOME%"=="" set JAVA_EXE=%JAVA_HOME%\bin\java

"%JAVA_EXE%" -classpath "gradle\wrapper\gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain %*
