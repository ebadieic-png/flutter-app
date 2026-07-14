/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Factory,
  Globe,
  Sun,
  Moon,
  Circle,
  Square,
  Timer,
  Play,
  RotateCcw,
  Scale,
  Hourglass,
  Gauge,
  Briefcase,
  Layers,
  ArrowRight,
  FileCode,
  Copy,
  Check,
  Smartphone,
  Cpu,
  Info,
  Sliders,
  Sparkles
} from 'lucide-react';

import { Language, ThemeMode, CalculationInputs, CalculationResults } from './types';
import { translations } from './translations';
import { flutterFiles } from './flutterCode';

export default function App() {
  // Persistence states
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('eic_lang');
    return (saved as Language) || 'fa';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('eic_theme');
    return (saved as ThemeMode) || 'light';
  });

  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'calculator' | 'flutter-code' | 'apk-guide'>('calculator');
  const [selectedFileIndex, setSelectedFileIndex] = useState(2); // main.dart by default
  const [copied, setCopied] = useState(false);

  // Operator Inputs State
  const [inputs, setInputs] = useState<CalculationInputs>({
    material: 'AL',
    shape: 'Round',
    diameter: '',
    width: '',
    thickness: '',
    timePerMeter: ''
  });

  // Calculation Results
  const [results, setResults] = useState<CalculationResults | null>(null);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Trigger splash auto-timeout (3 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Sync theme and RTL changes
  useEffect(() => {
    localStorage.setItem('eic_lang', lang);
    localStorage.setItem('eic_theme', theme);
  }, [lang, theme]);

  const t = translations[lang];
  const isRtl = lang === 'fa';

  const handleLanguageToggle = () => {
    setLang((prev) => (prev === 'fa' ? 'en' : 'fa'));
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const validateField = (name: string, value: string): string => {
    if (!value.trim()) {
      return t.errorEmpty;
    }
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return t.errorInvalid;
    }
    if (numValue < 0) {
      return t.errorNegative;
    }
    if (numValue === 0) {
      return t.errorZero;
    }
    return '';
  };

  const handleInputChange = (field: keyof CalculationInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate based on shape
    if (inputs.shape === 'Round') {
      const diameterErr = validateField('diameter', inputs.diameter);
      if (diameterErr) newErrors.diameter = diameterErr;
    } else {
      const widthErr = validateField('width', inputs.width);
      if (widthErr) newErrors.width = widthErr;

      const thicknessErr = validateField('thickness', inputs.thickness);
      if (thicknessErr) newErrors.thickness = thicknessErr;
    }

    const timeErr = validateField('timePerMeter', inputs.timePerMeter);
    if (timeErr) newErrors.timePerMeter = timeErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResults(null);
      return;
    }

    // Run exact EIC calculation logic
    const D = Number(inputs.diameter) || 0;
    const W = Number(inputs.width) || 0;
    const Th = Number(inputs.thickness) || 0;
    const T = Number(inputs.timePerMeter);

    // 1. Cross section (mm²)
    let area = 0;
    if (inputs.shape === 'Round') {
      area = (Math.PI * D * D) / 4;
    } else {
      area = W * Th;
    }

    // 2. Weight per meter (kg/m)
    // AL density = 2.7, CU density = 8.9
    const density = inputs.material === 'AL' ? 2.7 : 8.9;
    const weightPerMeter = (area * density) / 1000;

    // 3. Line Speed (m/min)
    const speed = 60 / T;

    // 4. Hourly Production (kg/h)
    const hourlyProduction = (3600 * weightPerMeter) / T;

    // 5. Shift Production (kg) - 7.5 hours shift
    const shiftProduction = hourlyProduction * 7.5;

    setResults({
      crossSection: area,
      weightPerMeter,
      speed,
      hourlyProduction,
      shiftProduction
    });
  };

  const handleClear = () => {
    setInputs({
      material: 'AL',
      shape: 'Round',
      diameter: '',
      width: '',
      thickness: '',
      timePerMeter: ''
    });
    setErrors({});
    setResults(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${theme === 'dark' ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F0F2F5] text-slate-900'}`}>
      
      {/* 1. BRANDED ANIMATED SPLASH SCREEN SCREEN */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D47A1] text-white"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <div className="text-center px-4 max-w-lg">
              <motion.div
                initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.2 }}
                className="w-32 h-32 bg-white rounded-[28px] mx-auto flex items-center justify-center shadow-2xl mb-8 border-4 border-blue-400"
              >
                <span className="text-[#0D47A1] font-display font-black text-5xl tracking-widest">EIC</span>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight"
              >
                {lang === 'fa' ? 'EIC' : 'EIC'}
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-sm sm:text-base text-blue-200 uppercase font-semibold tracking-widest mt-2"
              >
                {t.subtitle}
              </motion.p>

              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-400 border-t-white rounded-full animate-spin"></div>
                <span className="text-xs text-blue-300 tracking-wider font-mono">{t.splashHint}</span>
              </div>

              <p className="text-xs text-blue-400/80 mt-24">{t.footer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DUAL-PANEL LAYOUT CONTAINER */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        
        {/* TOP MAIN HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 pb-6 border-b border-slate-200/80 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#0D47A1] rounded-2xl flex items-center justify-center shadow-md shadow-blue-900/10">
              <span className="text-white font-display font-black text-2xl tracking-wider">EIC</span>
            </div>
            <div>
              <h1 className="text-xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">{t.subtitle}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 text-[10px] bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 rounded-md font-bold uppercase tracking-wider">
                  Industrial Systems
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'طراحی شده برای اپراتورهای کارخانه' : 'Engineered for Plant Operators'}
                </span>
              </div>
            </div>
          </div>

          {/* APP MODE ACTIONS */}
          <div className="flex items-center gap-2">
            {/* Splash Replay Button */}
            <button
              onClick={() => setShowSplash(true)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg flex items-center gap-1.5 transition shadow-sm font-semibold"
              title="Show Splash Screen"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              <span>{lang === 'fa' ? 'نمایش مجدد اسپلش' : 'Replay Splash'}</span>
            </button>

            {/* Language switch */}
            <button
              onClick={handleLanguageToggle}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 text-[#0D47A1] dark:text-blue-400 font-extrabold text-xs rounded-lg flex items-center gap-2 transition shadow-sm"
            >
              <Globe className="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
              <span>{lang === 'fa' ? 'English (EN)' : 'فارسی (FA)'}</span>
            </button>

            {/* Light/Dark Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition shadow-sm"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0D47A1]" />}
            </button>
          </div>
        </header>

        {/* WORKSPACE MODE NAVIGATION TABS */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2.5 font-semibold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === 'calculator'
                ? 'border-[#0D47A1] text-[#0D47A1] dark:border-blue-400 dark:text-blue-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{lang === 'fa' ? 'شبیه‌ساز برنامه اندروید' : 'Android App Simulator'}</span>
          </button>
          <button
            onClick={() => setActiveTab('flutter-code')}
            className={`px-4 py-2.5 font-semibold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === 'flutter-code'
                ? 'border-[#0D47A1] text-[#0D47A1] dark:border-blue-400 dark:text-blue-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>{lang === 'fa' ? 'مرورگر کدهای فلاتر' : 'Flutter Code Explorer'}</span>
          </button>
          <button
            onClick={() => setActiveTab('apk-guide')}
            className={`px-4 py-2.5 font-semibold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === 'apk-guide'
                ? 'border-[#0D47A1] text-[#0D47A1] dark:border-blue-400 dark:text-blue-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{lang === 'fa' ? 'راهنمای نصب APK' : 'APK Installation Guide'}</span>
          </button>
        </div>

        {/* VIEW AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* TAB 1: INTEGRATED ANDROID EMULATOR & THE CALC ENGINE */}
          <div className={`${activeTab === 'calculator' ? 'lg:col-span-12' : 'hidden'} w-full`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* MOBILE DEVICE FRAME WRAPPER */}
              <div className="md:col-span-5 flex justify-center">
                <div className="w-full max-w-[390px] bg-slate-900 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800 relative ring-8 ring-slate-950/25">
                  
                  {/* Smartphone Top Notch Sensor */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-full z-10 flex items-center justify-center">
                    <div className="w-3 h-3 bg-slate-800 rounded-full mr-2"></div>
                    <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                  </div>

                  {/* SCREEN CONTAINER */}
                  <div
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className={`rounded-[32px] overflow-hidden min-h-[690px] max-h-[800px] overflow-y-auto flex flex-col transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F0F2F5] text-slate-900'
                    }`}
                  >
                    {/* APPBAR SIMULATOR */}
                    <div className={`pt-8 pb-3 px-4 flex justify-between items-center border-b ${theme === 'dark' ? 'bg-[#131C2E] border-slate-800' : 'bg-[#0D47A1] text-white border-transparent'}`}>
                      <div>
                        <h2 className="font-display font-black text-lg leading-tight tracking-wider">{t.title}</h2>
                        <p className={`text-[9px] font-medium tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-blue-200'}`}>
                          {t.subtitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Device status indicators */}
                        <div className="flex gap-1 items-center opacity-70">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-[10px] font-mono">100%</span>
                        </div>
                      </div>
                    </div>

                    {/* OPERATOR PANEL BODY */}
                    <div className="p-4 flex-1 flex flex-col gap-4">
                      
                      {/* EIC Industrial Badge */}
                      <div className={`p-3.5 rounded-[28px] flex items-center gap-3 border ${
                        theme === 'dark' 
                          ? 'bg-[#131C2E] border-slate-800 text-slate-300' 
                          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                      }`}>
                        <div className="p-2 bg-[#0D47A1]/10 text-[#0D47A1] dark:bg-blue-400/10 dark:text-blue-400 rounded-xl">
                          <Factory className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider">{t.title}</p>
                          <p className="text-[10px] opacity-75">{t.subtitle}</p>
                        </div>
                      </div>

                      {/* Main Calculation Form */}
                      <form onSubmit={handleCalculate} className={`p-5 rounded-[28px] border flex flex-col gap-4 ${
                        theme === 'dark' ? 'bg-[#131C2E] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                      }`}>
                        <h3 className="text-xs font-display font-extrabold text-[#0D47A1] dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                          <Sliders className="w-4 h-4" />
                          <span>{t.operatorPanel}</span>
                        </h3>
                        <hr className="opacity-10 dark:opacity-20" />

                        {/* Material Radio Chip segment */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.material}</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleInputChange('material', 'AL')}
                              className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                inputs.material === 'AL'
                                  ? 'bg-[#0D47A1] border-[#0D47A1] text-white shadow-md shadow-blue-900/10'
                                  : theme === 'dark'
                                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                              {t.materialAl}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInputChange('material', 'CU')}
                              className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                inputs.material === 'CU'
                                  ? 'bg-[#D97706] border-[#D97706] text-white shadow-md shadow-amber-900/10'
                                  : theme === 'dark'
                                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              {t.materialCu}
                            </button>
                          </div>
                        </div>

                        {/* Product Shape Segment */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.productShape}</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleInputChange('shape', 'Round')}
                              className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                inputs.shape === 'Round'
                                  ? 'bg-[#0D47A1] border-[#0D47A1] text-white shadow-sm'
                                  : theme === 'dark'
                                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <Circle className="w-3.5 h-3.5" />
                              {t.round}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInputChange('shape', 'Rectangular')}
                              className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                inputs.shape === 'Rectangular'
                                  ? 'bg-[#0D47A1] border-[#0D47A1] text-white shadow-sm'
                                  : theme === 'dark'
                                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <Square className="w-3.5 h-3.5" />
                              {t.rectangular}
                            </button>
                          </div>
                        </div>

                        {/* Shape Specific Inputs */}
                        <div className="relative mt-1">
                          <AnimatePresence mode="wait">
                            {inputs.shape === 'Round' ? (
                              <motion.div
                                key="round-inputs"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-1"
                              >
                                <label className="text-xs font-bold">{t.diameter}</label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                                    <Circle className="w-4 h-4" />
                                  </span>
                                  <input
                                    type="number"
                                    step="any"
                                    placeholder={t.diameterHint}
                                    value={inputs.diameter}
                                    onChange={(e) => handleInputChange('diameter', e.target.value)}
                                    className={`w-full py-2.5 pl-10 pr-3 text-sm rounded-xl border outline-none font-mono transition ${
                                      errors.diameter
                                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] dark:border-slate-700 dark:bg-slate-900'
                                    }`}
                                  />
                                </div>
                                {errors.diameter && (
                                  <span className="text-[10px] text-red-500 font-medium mt-1">{errors.diameter}</span>
                                )}
                              </motion.div>
                            ) : (
                              <motion.div
                                key="rect-inputs"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-3"
                              >
                                <div className="flex flex-col gap-1">
                                  <label className="text-xs font-bold">{t.width}</label>
                                  <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                                      <Square className="w-4 h-4" />
                                    </span>
                                    <input
                                      type="number"
                                      step="any"
                                      placeholder={t.widthHint}
                                      value={inputs.width}
                                      onChange={(e) => handleInputChange('width', e.target.value)}
                                      className={`w-full py-2.5 pl-10 pr-3 text-sm rounded-xl border outline-none font-mono transition ${
                                        errors.width
                                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                                          : 'border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] dark:border-slate-700 dark:bg-slate-900'
                                      }`}
                                    />
                                  </div>
                                  {errors.width && (
                                    <span className="text-[10px] text-red-500 font-medium mt-1">{errors.width}</span>
                                  )}
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label className="text-xs font-bold">{t.thickness}</label>
                                  <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                                      <Layers className="w-4 h-4" />
                                    </span>
                                    <input
                                      type="number"
                                      step="any"
                                      placeholder={t.thicknessHint}
                                      value={inputs.thickness}
                                      onChange={(e) => handleInputChange('thickness', e.target.value)}
                                      className={`w-full py-2.5 pl-10 pr-3 text-sm rounded-xl border outline-none font-mono transition ${
                                        errors.thickness
                                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                                          : 'border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] dark:border-slate-700 dark:bg-slate-900'
                                      }`}
                                    />
                                  </div>
                                  {errors.thickness && (
                                    <span className="text-[10px] text-red-500 font-medium mt-1">{errors.thickness}</span>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Speed/Time required input */}
                        <div className="flex flex-col gap-1 mt-1">
                          <label className="text-xs font-bold">{t.timePerMeter}</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                              <Timer className="w-4 h-4" />
                            </span>
                            <input
                              type="number"
                              step="any"
                              placeholder={t.timeHint}
                              value={inputs.timePerMeter}
                              onChange={(e) => handleInputChange('timePerMeter', e.target.value)}
                              className={`w-full py-2.5 pl-10 pr-3 text-sm rounded-xl border outline-none font-mono transition ${
                                errors.timePerMeter
                                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                                  : 'border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] dark:border-slate-700 dark:bg-slate-900'
                              }`}
                            />
                          </div>
                          {errors.timePerMeter && (
                            <span className="text-[10px] text-red-500 font-medium mt-1">{errors.timePerMeter}</span>
                          )}
                        </div>

                        {/* Large Action Buttons */}
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <button
                            type="submit"
                            className="col-span-2 py-3.5 px-4 bg-[#0D47A1] hover:bg-[#0A3C8B] text-white font-extrabold text-sm rounded-xl transition flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-900/10"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>{t.calculate}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleClear}
                            className="py-3.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95 border border-transparent dark:border-slate-750"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>{t.clear}</span>
                          </button>
                        </div>
                      </form>

                      {/* Display Outputs within Rounded cards */}
                      {results && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col gap-3 mt-2"
                        >
                          <h4 className="text-xs font-display font-black text-slate-400 uppercase tracking-widest px-1">
                            {t.resultsPanel}
                          </h4>

                          {/* Cross section */}
                          <div className={`p-3.5 rounded-[16px] border-l-4 border-l-[#0D47A1] flex items-center justify-between shadow-sm border border-slate-200/80 ${
                            theme === 'dark' ? 'bg-[#131C2E] border-slate-800' : 'bg-white'
                          }`}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#0D47A1]/10 text-[#0D47A1] dark:bg-blue-400/10 dark:text-blue-400 flex items-center justify-center">
                                <Square className="w-4 h-4" />
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{t.crossSection}</span>
                            </div>
                            <span className="text-sm font-black font-mono">
                              {results.crossSection.toFixed(3)} <span className="text-[10px] text-slate-400 font-normal">mm²</span>
                            </span>
                          </div>

                          {/* Weight per Meter */}
                          <div className={`p-3.5 rounded-[16px] border-l-4 border-l-[#0D47A1] flex items-center justify-between shadow-sm border border-slate-200/80 ${
                            theme === 'dark' ? 'bg-[#131C2E] border-slate-800' : 'bg-white'
                          }`}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#0D47A1]/10 text-[#0D47A1] dark:bg-blue-400/10 dark:text-blue-400 flex items-center justify-center">
                                <Scale className="w-4 h-4" />
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{t.weightPerMeter}</span>
                            </div>
                            <span className="text-sm font-black font-mono">
                              {results.weightPerMeter.toFixed(3)} <span className="text-[10px] text-slate-400 font-normal">kg/m</span>
                            </span>
                          </div>

                          {/* Line Speed */}
                          <div className={`p-3.5 rounded-[16px] border-l-4 border-l-[#0D47A1] flex items-center justify-between shadow-sm border border-slate-200/80 ${
                            theme === 'dark' ? 'bg-[#131C2E] border-slate-800' : 'bg-white'
                          }`}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#0D47A1]/10 text-[#0D47A1] dark:bg-blue-400/10 dark:text-blue-400 flex items-center justify-center">
                                <Gauge className="w-4 h-4" />
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{t.speed}</span>
                            </div>
                            <span className="text-sm font-black font-mono">
                              {results.speed.toFixed(3)} <span className="text-[10px] text-slate-400 font-normal">m/min</span>
                            </span>
                          </div>

                          {/* Hourly Production */}
                          <div className={`p-3.5 rounded-[16px] border-l-4 border-l-[#0D47A1] flex items-center justify-between shadow-sm border border-slate-200/80 ${
                            theme === 'dark' ? 'bg-[#131C2E] border-slate-800' : 'bg-white'
                          }`}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#0D47A1]/10 text-[#0D47A1] dark:bg-blue-400/10 dark:text-blue-400 flex items-center justify-center">
                                <Hourglass className="w-4 h-4" />
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{t.hourlyProduction}</span>
                            </div>
                            <span className="text-sm font-black font-mono text-[#0D47A1] dark:text-blue-400">
                              {results.hourlyProduction.toFixed(3)} <span className="text-[10px] text-slate-450 font-normal">kg/h</span>
                            </span>
                          </div>

                          {/* Shift production */}
                          <div className={`p-4 rounded-[20px] border border-slate-200/80 border-l-4 border-l-emerald-500 flex items-center justify-between shadow-sm ${
                            theme === 'dark' ? 'bg-[#15231c] border-slate-800/80' : 'bg-emerald-50/20'
                          }`}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Briefcase className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">{t.shiftProduction}</span>
                                <span className="text-[9px] text-slate-450">{lang === 'fa' ? 'شیفت ۷.۵ ساعته' : '7.5 hours shift limit'}</span>
                              </div>
                            </div>
                            <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                              {results.shiftProduction.toFixed(3)} <span className="text-[11px] text-slate-450 font-normal">kg</span>
                            </span>
                          </div>
                        </motion.div>
                      )}

                    </div>

                    {/* Footer developed by */}
                    <div className="p-4 text-center mt-auto border-t border-slate-200/50 dark:border-slate-800/50">
                      <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                        {t.footer}
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* SIMULATOR INFO SECTION */}
              <div className="md:col-span-7 flex flex-col gap-6">
                <div className={`p-6 rounded-[28px] border ${theme === 'dark' ? 'bg-[#131C2E]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-xl font-display font-black text-[#0D47A1] dark:text-blue-400 flex items-center gap-2">
                    <Smartphone className="w-6 h-6 animate-pulse" />
                    <span>{lang === 'fa' ? 'راهنمای کاربری سیستم محاسباتی EIC' : 'EIC Computational System User Guide'}</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                    {lang === 'fa' 
                      ? 'این بخش شبیه‌ساز نسخه نهایی اندروید برنامه EIC است. اپراتورهای کارخانه می‌توانند با ورود اطلاعات شمش یا میلگردهای مسی (CU) و آلومینیومی (AL) مساحت سطح مقطع، وزن خطی بر متر، سرعت متحرک بر حسب متر بر ثانیه، تناژ تولید ساعتی و تناژ شیفت ۷.۵ ساعته را محاسبه کنند.'
                      : 'This is the high-fidelity simulator of the final EIC Android application. Factory operators can input Copper (CU) or Aluminium (AL) specifications to obtain the cross-sectional area, linear weight per meter, extrusion line speed, hourly tonnage, and 7.5-hour shift productivity.'
                    }
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className={`p-4.5 rounded-[20px] border ${theme === 'dark' ? 'bg-[#0B0F19]/60 border-slate-800' : 'bg-slate-50/50 border-slate-200/80'}`}>
                      <h4 className="text-xs font-bold text-[#0D47A1] flex items-center gap-1.5 uppercase tracking-wider mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]"></span>
                        {lang === 'fa' ? 'فرمول مساحت سطح مقطع' : 'Cross-Section Calculations'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {lang === 'fa' ? 'گرد: Area = π × D² / 4' : 'Round: Area = π × D² / 4'}
                        <br />
                        {lang === 'fa' ? 'تخت: Area = Width × Thickness' : 'Rectangular: Area = Width × Thickness'}
                      </p>
                    </div>

                    <div className={`p-4.5 rounded-[20px] border ${theme === 'dark' ? 'bg-[#0B0F19]/60 border-slate-800' : 'bg-slate-50/50 border-slate-200/80'}`}>
                      <h4 className="text-xs font-bold text-[#D97706] flex items-center gap-1.5 uppercase tracking-wider mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>
                        {lang === 'fa' ? 'فرمول محاسبه وزن در هر متر' : 'Linear Weight calculations'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        AL: Area × 2.7 / 1000 (kg/m)
                        <br />
                        CU: Area × 8.9 / 1000 (kg/m)
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-[#0D47A1]/5 dark:bg-blue-950/40 rounded-[20px] border border-[#0D47A1]/20 dark:border-blue-800/30 text-[#0D47A1] dark:text-blue-300 flex gap-3">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <strong>{lang === 'fa' ? 'همزمانی همیشگی:' : 'Always in sync:'}</strong>{' '}
                      {lang === 'fa'
                        ? 'کدهای کامل این برنامه هم‌اکنون به عنوان پروژه‌ی آماده نصب فلاتر در محیط توسعه شما (Workspace) ذخیره شده‌اند. شما می‌توانید از منوی بالا تب‌های کدهای منبع را مرور کرده و به صورت فایل ZIP دانلود نمایید.'
                        : 'The entire source code of this Flutter app is already created and organized inside your workspace directory. You can inspect individual files in the subsequent tabs and export the project as a ZIP bundle anytime.'}
                    </div>
                  </div>
                </div>

                {/* Operator Actions Showcase */}
                <div className={`p-6 rounded-[28px] border ${theme === 'dark' ? 'bg-[#131C2E]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h4 className="text-sm font-display font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                    {lang === 'fa' ? 'دستورالعمل تولید و کنترل فرآیند' : 'Production Control Dashboard'}
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{lang === 'fa' ? 'توسعه‌دهنده فلاتر و اندروید' : 'Android Lead Developer'}</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">Salah Ebadi</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{lang === 'fa' ? 'پلتفرم اندروید' : 'Target Platform'}</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">Android APK (API 21+)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{lang === 'fa' ? 'تکنولوژی لایه نمایش' : 'Framework Engine'}</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">Flutter 3.x (Stable)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* TAB 2: FLUTTER CODE EXPLORER */}
          <div className={`${activeTab === 'flutter-code' ? 'lg:col-span-12' : 'hidden'} w-full`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left File Tree Panel */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <div className={`p-4 rounded-[28px] border ${theme === 'dark' ? 'bg-[#131C2E]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-sm font-display font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'لیست فایل‌های فلاتر' : 'Flutter Source Files'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    {t.flutterCodeHubDesc}
                  </p>
                  <div className="flex flex-col gap-1 max-h-[350px] overflow-y-auto pr-1">
                    {flutterFiles.map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedFileIndex(idx);
                          setCopied(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition flex items-center gap-2 ${
                          selectedFileIndex === idx
                            ? 'bg-[#0D47A1] text-white font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <FileCode className="w-4 h-4 shrink-0" />
                        <span className="truncate">{file.path}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-[20px] border ${theme === 'dark' ? 'bg-[#131C2E]/60 border-slate-800' : 'bg-slate-50 border-slate-200/80'}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-[#0D47A1]" />
                    <span>{lang === 'fa' ? 'درباره این فایل' : 'About Selected File'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {flutterFiles[selectedFileIndex].description}
                  </p>
                </div>
              </div>

              {/* Right Code Display Panel */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                <div className="bg-[#0B0F19] text-slate-200 rounded-[28px] overflow-hidden border border-slate-800 shadow-xl flex flex-col">
                  
                  {/* Code Bar Header */}
                  <div className="px-6 py-4 bg-[#090C15] flex justify-between items-center border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-mono text-slate-400 ml-4 font-bold">
                        /flutter_project/{flutterFiles[selectedFileIndex].path}
                      </span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(flutterFiles[selectedFileIndex].code)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? t.copied : t.copyCode}</span>
                    </button>
                  </div>

                  {/* Preformatted code area */}
                  <div className="p-6 overflow-x-auto max-h-[500px] font-mono text-xs leading-relaxed text-slate-300 bg-[#0B0F19] scrollbar-thin">
                    <pre className="whitespace-pre">{flutterFiles[selectedFileIndex].code}</pre>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* TAB 3: APK COMPILATION GUIDE */}
          <div className={`${activeTab === 'apk-guide' ? 'lg:col-span-12' : 'hidden'} w-full`}>
            <div className={`p-6 md:p-8 rounded-[28px] border ${theme === 'dark' ? 'bg-[#131C2E]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-xl font-display font-black text-[#0D47A1] dark:text-blue-400 mb-2 flex items-center gap-2">
                <Cpu className="w-6 h-6 text-green-500 animate-pulse" />
                <span>{lang === 'fa' ? 'دستورالعمل خروجی گرفتن APK اندروید' : 'Steps to Compile and Install EIC APK'}</span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                {t.apkGuideDesc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Step 1 */}
                <div className={`p-5 rounded-[20px] border flex flex-col gap-3 ${theme === 'dark' ? 'bg-[#0B0F19]/60 border-slate-800' : 'bg-slate-50/50 border-slate-200/80'}`}>
                  <div className="w-8 h-8 rounded-full bg-[#0D47A1] text-white font-extrabold text-sm flex items-center justify-center">
                    1
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {lang === 'fa' ? 'دانلود پروژه فلاتر' : 'Export and Extract'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {lang === 'fa'
                      ? 'از منوی تنظیمات بالا سمت راست محیط کار خود، پروژه را به صورت ZIP دانلود کنید یا آن را به GitHub خود متصل کرده و انتقال دهید. پوشه flutter_project را استخراج کنید.'
                      : 'Download your applet as a ZIP file or link it to GitHub using the Settings panel in the top-right corner. Extract the flutter_project directory to your system.'}
                  </p>
                </div>

                {/* Step 2 */}
                <div className={`p-5 rounded-[20px] border flex flex-col gap-3 ${theme === 'dark' ? 'bg-[#0B0F19]/60 border-slate-800' : 'bg-slate-50/50 border-slate-200/80'}`}>
                  <div className="w-8 h-8 rounded-full bg-[#0D47A1] text-white font-extrabold text-sm flex items-center justify-center">
                    2
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {lang === 'fa' ? 'نصب وابستگی‌ها' : 'Install Dependencies'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {lang === 'fa'
                      ? 'یک ترمینال در پوشه پروژه باز کنید و دستور زیر را برای دریافت کتابخانه‌ها و فایل‌های چندزبانه خودکار اجرا کنید:'
                      : 'Open a terminal inside the project directory and run the following commands to install packages and trigger the Flutter localizations system:'}
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-[10px] text-blue-400 select-all border border-slate-800">
                    flutter pub get
                  </div>
                </div>

                {/* Step 3 */}
                <div className={`p-5 rounded-[20px] border flex flex-col gap-3 ${theme === 'dark' ? 'bg-[#0B0F19]/60 border-slate-800' : 'bg-slate-50/50 border-slate-200/80'}`}>
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white font-extrabold text-sm flex items-center justify-center">
                    3
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {lang === 'fa' ? 'کامپایل نهایی APK' : 'Compile Release APK'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {lang === 'fa'
                      ? 'اکنون دستور کامپایل بهینه شده اندروید را اجرا کنید تا یک فایل نصب مستقیم تکی تولید شود:'
                      : 'Compile the codebase into a single optimized standalone APK ready to be sideloaded on any Android phone:'}
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-[10px] text-green-400 select-all border border-slate-800">
                    flutter build apk --release
                  </div>
                </div>

              </div>

              {/* Install and Run APK Note */}
              <div className="mt-8 p-5 bg-[#10b981]/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-[20px] flex gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 self-start">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-extrabold text-emerald-850 dark:text-emerald-400">
                    {lang === 'fa' ? 'محل ذخیره فایل APK نهایی:' : 'Where is my APK file?'}
                  </span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">
                    build/app/outputs/flutter-apk/app-release.apk
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {lang === 'fa'
                      ? 'این فایل APK را با استفاده از پیام‌رسان‌ها، کابل یا بلوتوث به گوشی خود ارسال کنید، روی آن تپ کنید و روی دکمه Install کلیک کنید تا مثل یک برنامه حرفه‌ای روی گوشی اندرویدی شما نصب و راه‌اندازی شود.'
                      : 'Transfer this APK to your phone via USB cable, email, or local sharing, then simply tap it in your device File Manager and select Install. Now EIC is ready to launch right from your device app drawer!'}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
