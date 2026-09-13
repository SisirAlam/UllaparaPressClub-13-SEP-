package com.ullaparapressclub.app.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = PressTealPrimaryDark,
    onPrimary = PressTealDark,
    primaryContainer = PressTealContainerDark,
    onPrimaryContainer = PressTealOnContainerDark,
    secondary = PressGoldSecondary,
    onSecondary = SurfaceDark,
    secondaryContainer = PressGoldOnContainer,
    onSecondaryContainer = PressGoldContainer,
    background = BackgroundDark,
    onBackground = OnSurfaceDark,
    surface = SurfaceDark,
    onSurface = OnSurfaceDark,
    surfaceVariant = SurfaceVariantDark,
    onSurfaceVariant = OnSurfaceVariantDark,
    outline = OutlineDark
)

private val LightColorScheme = lightColorScheme(
    primary = PressTealPrimary,
    onPrimary = SurfaceLight,
    primaryContainer = PressTealContainer,
    onPrimaryContainer = PressTealOnContainer,
    secondary = PressGoldSecondary,
    onSecondary = SurfaceLight,
    secondaryContainer = PressGoldContainer,
    onSecondaryContainer = PressGoldOnContainer,
    background = BackgroundLight,
    onBackground = OnSurfaceLight,
    surface = SurfaceLight,
    onSurface = OnSurfaceLight,
    surfaceVariant = SurfaceVariantLight,
    onSurfaceVariant = OnSurfaceVariantLight,
    outline = OutlineLight
)

@Composable
fun UllaparaPressClubTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
