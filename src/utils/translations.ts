export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'ko' | 'zh';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.dashboard': {
    en: 'Dashboard',
    es: 'Panel',
    fr: 'Tableau de bord',
    de: 'Dashboard',
    it: 'Dashboard',
    pt: 'Painel',
    ja: 'ダッシュボード',
    ko: '대시보드',
    zh: '仪表板'
  },
  'nav.meetings': {
    en: 'Meetings',
    es: 'Reuniones',
    fr: 'Réunions',
    de: 'Besprechungen',
    it: 'Riunioni',
    pt: 'Reuniões',
    ja: '会議',
    ko: '회의',
    zh: '会议'
  },
  'nav.analytics': {
    en: 'Analytics',
    es: 'Análisis',
    fr: 'Analytiques',
    de: 'Analysen',
    it: 'Analisi',
    pt: 'Análises',
    ja: '分析',
    ko: '분석',
    zh: '分析'
  },
  'nav.settings': {
    en: 'Settings',
    es: 'Configuración',
    fr: 'Paramètres',
    de: 'Einstellungen',
    it: 'Impostazioni',
    pt: 'Configurações',
    ja: '設定',
    ko: '설정',
    zh: '设置'
  },
  
  // Settings page
  'settings.title': {
    en: 'Settings',
    es: 'Configuración',
    fr: 'Paramètres',
    de: 'Einstellungen',
    it: 'Impostazioni',
    pt: 'Configurações',
    ja: '設定',
    ko: '설정',
    zh: '设置'
  },
  'settings.interface': {
    en: '🎨 Interface',
    es: '🎨 Interfaz',
    fr: '🎨 Interface',
    de: '🎨 Benutzeroberfläche',
    it: '🎨 Interfaccia',
    pt: '🎨 Interface',
    ja: '🎨 インターフェース',
    ko: '🎨 인터페이스',
    zh: '🎨 界面'
  },
  'settings.theme': {
    en: 'Theme',
    es: 'Tema',
    fr: 'Thème',
    de: 'Design',
    it: 'Tema',
    pt: 'Tema',
    ja: 'テーマ',
    ko: '테마',
    zh: '主题'
  },
  'settings.language': {
    en: 'Language',
    es: 'Idioma',
    fr: 'Langue',
    de: 'Sprache',
    it: 'Lingua',
    pt: 'Idioma',
    ja: '言語',
    ko: '언어',
    zh: '语言'
  },
  'settings.save': {
    en: '💾 Save Settings',
    es: '💾 Guardar Configuración',
    fr: '💾 Enregistrer les Paramètres',
    de: '💾 Einstellungen Speichern',
    it: '💾 Salva Impostazioni',
    pt: '💾 Salvar Configurações',
    ja: '💾 設定を保存',
    ko: '💾 설정 저장',
    zh: '💾 保存设置'
  },
  'settings.reset': {
    en: '🔄 Reset Changes',
    es: '🔄 Restablecer Cambios',
    fr: '🔄 Réinitialiser les Modifications',
    de: '🔄 Änderungen Zurücksetzen',
    it: '🔄 Ripristina Modifiche',
    pt: '🔄 Resetar Alterações',
    ja: '🔄 変更をリセット',
    ko: '🔄 변경사항 재설정',
    zh: '🔄 重置更改'
  },
  'settings.lightTheme': {
    en: 'Light',
    es: 'Claro',
    fr: 'Clair',
    de: 'Hell',
    it: 'Chiaro',
    pt: 'Claro',
    ja: 'ライト',
    ko: '라이트',
    zh: '浅色'
  },
  'settings.darkTheme': {
    en: 'Dark',
    es: 'Oscuro',
    fr: 'Sombre',
    de: 'Dunkel',
    it: 'Scuro',
    pt: 'Escuro',
    ja: 'ダーク',
    ko: '다크',
    zh: '深色'
  },
  'settings.autoTheme': {
    en: 'Auto (System preference)',
    es: 'Auto (Preferencia del sistema)',
    fr: 'Auto (Préférence système)',
    de: 'Auto (Systemeinstellung)',
    it: 'Auto (Preferenza sistema)',
    pt: 'Auto (Preferência do sistema)',
    ja: '自動（システム設定）',
    ko: '자동 (시스템 기본 설정)',
    zh: '自动（系统偏好）'
  },
  'settings.themePreview': {
    en: 'Theme Preview',
    es: 'Vista Previa del Tema',
    fr: 'Aperçu du Thème',
    de: 'Theme-Vorschau',
    it: 'Anteprima Tema',
    pt: 'Visualização do Tema',
    ja: 'テーマプレビュー',
    ko: '테마 미리보기',
    zh: '主题预览'
  },
  'settings.themePreviewDescription': {
    en: 'Choose your preferred color scheme (preview only - save to apply)',
    es: 'Elige tu esquema de colores preferido (solo vista previa - guarda para aplicar)',
    fr: 'Choisissez votre schéma de couleurs préféré (aperçu uniquement - enregistrez pour appliquer)',
    de: 'Wählen Sie Ihr bevorzugtes Farbschema (nur Vorschau - speichern zum Anwenden)',
    it: 'Scegli il tuo schema di colori preferito (solo anteprima - salva per applicare)',
    pt: 'Escolha seu esquema de cores preferido (apenas visualização - salve para aplicar)',
    ja: '好みのカラースキームを選択（プレビューのみ - 適用するには保存）',
    ko: '선호하는 색상 테마를 선택하세요 (미리보기만 - 적용하려면 저장)',
    zh: '选择您喜欢的配色方案（仅预览 - 保存以应用）'
  },
  'settings.languageDescription': {
    en: 'Select your preferred language (save to apply)',
    es: 'Selecciona tu idioma preferido (guarda para aplicar)',
    fr: 'Sélectionnez votre langue préférée (enregistrez pour appliquer)',
    de: 'Wählen Sie Ihre bevorzugte Sprache (speichern zum Anwenden)',
    it: 'Seleziona la tua lingua preferita (salva per applicare)',
    pt: 'Selecione seu idioma preferido (salve para aplicar)',
    ja: '希望の言語を選択（適用するには保存）',
    ko: '선호하는 언어를 선택하세요 (적용하려면 저장)',
    zh: '选择您的首选语言（保存以应用）'
  },
  'settings.notifications': {
    en: 'Enable Notifications',
    es: 'Habilitar Notificaciones',
    fr: 'Activer les Notifications',
    de: 'Benachrichtigungen Aktivieren',
    it: 'Abilita Notifiche',
    pt: 'Ativar Notificações',
    ja: '通知を有効にする',
    ko: '알림 활성화',
    zh: '启用通知'
  },
  'settings.notificationsDescription': {
    en: 'Show browser notifications when processing is complete',
    es: 'Mostrar notificaciones del navegador cuando se complete el procesamiento',
    fr: 'Afficher les notifications du navigateur lorsque le traitement est terminé',
    de: 'Browser-Benachrichtigungen anzeigen, wenn die Verarbeitung abgeschlossen ist',
    it: 'Mostra notifiche del browser quando l\'elaborazione è completata',
    pt: 'Mostrar notificações do navegador quando o processamento estiver concluído',
    ja: '処理が完了したときにブラウザ通知を表示',
    ko: '처리가 완료되면 브라우저 알림 표시',
    zh: '处理完成时显示浏览器通知'
  },
  'settings.unsavedChanges': {
    en: 'Unsaved Changes',
    es: 'Cambios no Guardados',
    fr: 'Modifications non Enregistrées',
    de: 'Nicht Gespeicherte Änderungen',
    it: 'Modifiche non Salvate',
    pt: 'Alterações não Salvas',
    ja: '未保存の変更',
    ko: '저장되지 않은 변경사항',
    zh: '未保存的更改'
  },

  // Common
  'common.loading': {
    en: 'Loading...',
    es: 'Cargando...',
    fr: 'Chargement...',
    de: 'Laden...',
    it: 'Caricamento...',
    pt: 'Carregando...',
    ja: '読み込み中...',
    ko: '로딩 중...',
    zh: '加载中...'
  },
  'common.save': {
    en: 'Save Settings',
    es: 'Guardar Configuración',
    fr: 'Enregistrer les Paramètres',
    de: 'Einstellungen Speichern',
    it: 'Salva Impostazioni',
    pt: 'Salvar Configurações',
    ja: '設定を保存',
    ko: '설정 저장',
    zh: '保存设置'
  },
  'common.reset': {
    en: 'Reset Changes',
    es: 'Restablecer Cambios',
    fr: 'Réinitialiser les Modifications',
    de: 'Änderungen Zurücksetzen',
    it: 'Ripristina Modifiche',
    pt: 'Resetar Alterações',
    ja: '変更をリセット',
    ko: '변경사항 재설정',
    zh: '重置更改'
  },
  'common.saving': {
    en: 'Saving...',
    es: 'Guardando...',
    fr: 'Enregistrement...',
    de: 'Speichern...',
    it: 'Salvataggio...',
    pt: 'Salvando...',
    ja: '保存中...',
    ko: '저장 중...',
    zh: '保存中...'
  },
  'common.on': {
    en: 'On',
    es: 'Activado',
    fr: 'Activé',
    de: 'Ein',
    it: 'Attivo',
    pt: 'Ativado',
    ja: 'オン',
    ko: '켜짐',
    zh: '开'
  },
  'common.off': {
    en: 'Off',
    es: 'Desactivado',
    fr: 'Désactivé',
    de: 'Aus',
    it: 'Disattivo',
    pt: 'Desativado',
    ja: 'オフ',
    ko: '꺼짐',
    zh: '关'
  },
  'common.cancel': {
    en: 'Cancel',
    es: 'Cancelar',
    fr: 'Annuler',
    de: 'Abbrechen',
    it: 'Annulla',
    pt: 'Cancelar',
    ja: 'キャンセル',
    ko: '취소',
    zh: '取消'
  }
};

export function useTranslation(language: Language) {
  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  return { t };
}

export default translations;
