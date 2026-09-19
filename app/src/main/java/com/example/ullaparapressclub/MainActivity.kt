package com.example.ullaparapressclub

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.example.ullaparapressclub.ui.MainScreen
import com.example.ullaparapressclub.ui.theme.UllaparaPressClubTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            UllaparaPressClubTheme {
                MainScreen()
            }
        }
    }
}
