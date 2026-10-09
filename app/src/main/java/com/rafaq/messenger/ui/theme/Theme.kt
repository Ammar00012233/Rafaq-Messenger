package com.rafaq.messenger.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = Color(0xFF4F46E5),
    onPrimary = Color.White,
    secondary = Color(0xFF14B8A6),
    background = Color(0xFFF5F7FF),
    surface = Color.White,
    onSurface = Color(0xFF111827)
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFF8B5CF6),
    secondary = Color(0xFF2DD4BF),
    background = Color(0xFF0F172A),
    surface = Color(0xFF111827),
    onSurface = Color(0xFFE5E7EB)
)

@Composable
fun RafaqMessengerTheme(
    darkTheme: Boolean = false,
    content: @Composable () -> Unit
) {
    val colors = if (darkTheme) DarkColors else LightColors
    MaterialTheme(
        colorScheme = colors,
        content = content
    )
}
