# EIC - Ebadi Industrial Consultants Calculator

A professional, production-ready Flutter application for Android, designed with a clean, responsive Material Design 3 interface for factory operators.

## Features

- **Dual-Language Support**: Complete Persian (RTL) and English (LTR) language support with persistent toggle.
- **Material Design 3 Theme**: High-contrast blue-and-white theme with dark mode and light mode persistent selection.
- **Calculations**:
  - **Cross-Section Area (mm²)**: Supports Round (diameters) and Rectangular (width, thickness) configurations.
  - **Weight per Meter (kg/m)**: Uses accurate density ratios for AL (Aluminium, 2.7) and CU (Copper, 8.9).
  - **Extrusion / Move Speed (m/min)**: Instant, operator-friendly speed conversion based on time (seconds per meter).
  - **Hourly Production (kg/h)**: Precise scaling from linear weights and movement cycles.
  - **7.5-Hour Shift Production (kg)**: Crucial factory performance tracking.
- **Robust Field Validation**: Restricts zero, negative, or empty entries with active RTL-aware notifications.
- **Animated Splash Screen**: Elastic-bound letter transition for the EIC brand name.

---

## Getting Started

### Prerequisites

1. Install the [Flutter SDK](https://docs.flutter.dev/get-started/install) (version `>=3.0.0`).
2. Install [Android Studio](https://developer.android.com/studio) or VS Code with Flutter extensions.

### Installation & Run

1. Open a terminal inside this `/flutter_project` directory.
2. Retrieve the dependencies:
   ```bash
   flutter pub get
   ```
3. Run the application in developer mode on an emulator or plugged Android device:
   ```bash
   flutter run
   ```

### Building the Release APK

To compile a highly optimized, single-bundle release APK for installation on physical Android phones:

1. Run the flutter build tool:
   ```bash
   flutter build apk --release
   ```
2. Retrieve the generated `.apk` file from:
   `build/app/outputs/flutter-apk/app-release.apk`
3. Send this file to any Android device and tap to install it!

---

## File Structure

- `lib/main.dart` - App state, localization, and Theme initialization.
- `lib/models/calculation_model.dart` - Pure mathematical engine for the calculations.
- `lib/services/storage_service.dart` - `SharedPreferences` persistence wrappers.
- `lib/pages/home_page.dart` - Main operator interface with RTL toggles.
- `lib/widgets/` - UI components (Result Cards, Slash Screen, etc.).
- `lib/l10n/` - Localization dictionaries.

Developed by **Salah Ebadi** for **Ebadi Industrial Consultants (EIC)**.
