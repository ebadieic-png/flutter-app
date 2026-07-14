import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static late SharedPreferences _prefs;
  static const String _localeKey = 'eic_locale';
  static const String _darkModeKey = 'eic_dark_mode';

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  static Locale getLocale() {
    final String? code = _prefs.getString(_localeKey);
    if (code == 'en') {
      return const Locale('en');
    }
    return const Locale('fa');
  }

  static Future<void> setLocale(String languageCode) async {
    await _prefs.setString(_localeKey, languageCode);
  }

  static ThemeMode getThemeMode() {
    final bool? isDark = _prefs.getBool(_darkModeKey);
    if (isDark == true) {
      return ThemeMode.dark;
    }
    return ThemeMode.light;
  }

  static Future<void> setThemeMode(bool isDark) async {
    await _prefs.setBool(_darkModeKey, isDark);
  }
}
