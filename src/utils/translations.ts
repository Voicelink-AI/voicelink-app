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
  'nav.chat': {
    en: 'AI Assistant',
    es: 'Asistente IA',
    fr: 'Assistant IA',
    de: 'KI-Assistent',
    it: 'Assistente IA',
    pt: 'Assistente IA',
    ja: 'AIアシスタント',
    ko: 'AI 어시스턴트',
    zh: 'AI助手'
  },
  'nav.systemMonitor': {
    en: 'System Monitor',
    es: 'Monitor del Sistema',
    fr: 'Moniteur Système',
    de: 'Systemmonitor',
    it: 'Monitor Sistema',
    pt: 'Monitor do Sistema',
    ja: 'システムモニター',
    ko: '시스템 모니터',
    zh: '系统监控'
  },

  // Dashboard
  'dashboard.welcome': {
    en: 'VoiceLink Dashboard',
    es: 'Panel de VoiceLink',
    fr: 'Tableau de bord VoiceLink',
    de: 'VoiceLink Dashboard',
    it: 'Dashboard VoiceLink',
    pt: 'Painel VoiceLink',
    ja: 'VoiceLinkダッシュボード',
    ko: 'VoiceLink 대시보드',
    zh: 'VoiceLink仪表板'
  },
  'dashboard.totalMeetings': {
    en: 'Total Meetings',
    es: 'Reuniones Totales',
    fr: 'Réunions Totales',
    de: 'Gesamte Besprechungen',
    it: 'Riunioni Totali',
    pt: 'Reuniões Totais',
    ja: '総会議数',
    ko: '총 회의',
    zh: '总会议数'
  },
  'dashboard.totalParticipants': {
    en: 'Total Participants',
    es: 'Participantes Totales',
    fr: 'Participants Totaux',
    de: 'Gesamte Teilnehmer',
    it: 'Partecipanti Totali',
    pt: 'Participantes Totais',
    ja: '総参加者数',
    ko: '총 참가자',
    zh: '总参与者'
  },
  'dashboard.activeMeetings': {
    en: 'Active Meetings',
    es: 'Reuniones Activas',
    fr: 'Réunions Actives',
    de: 'Aktive Besprechungen',
    it: 'Riunioni Attive',
    pt: 'Reuniões Ativas',
    ja: 'アクティブ会議',
    ko: '활성 회의',
    zh: '活跃会议'
  },
  'dashboard.speakingTime': {
    en: 'Speaking Time',
    es: 'Tiempo de Habla',
    fr: 'Temps de Parole',
    de: 'Sprechzeit',
    it: 'Tempo di Parola',
    pt: 'Tempo de Fala',
    ja: '発言時間',
    ko: '발언 시간',
    zh: '发言时间'
  },
  'dashboard.meetingCreated': {
    en: 'Meeting Created!',
    es: '¡Reunión Creada!',
    fr: 'Réunion Créée !',
    de: 'Besprechung Erstellt!',
    it: 'Riunione Creata!',
    pt: 'Reunião Criada!',
    ja: '会議が作成されました！',
    ko: '회의가 생성되었습니다!',
    zh: '会议已创建！'
  },
  'dashboard.meetingCreatedDesc': {
    en: 'Your audio has been uploaded and a meeting record created.',
    es: 'Tu audio ha sido subido y se ha creado un registro de reunión.',
    fr: 'Votre audio a été téléchargé et un enregistrement de réunion créé.',
    de: 'Ihr Audio wurde hochgeladen und ein Besprechungsdatensatz erstellt.',
    it: 'Il tuo audio è stato caricato e un record della riunione è stato creato.',
    pt: 'Seu áudio foi enviado e um registro de reunião foi criado.',
    ja: 'オーディオがアップロードされ、会議記録が作成されました。',
    ko: '오디오가 업로드되고 회의 기록이 생성되었습니다.',
    zh: '您的音频已上传，会议记录已创建。'
  },
  'dashboard.viewMeeting': {
    en: 'View Meeting',
    es: 'Ver Reunión',
    fr: 'Voir la Réunion',
    de: 'Besprechung Anzeigen',
    it: 'Visualizza Riunione',
    pt: 'Ver Reunião',
    ja: '会議を表示',
    ko: '회의 보기',
    zh: '查看会议'
  },
  'dashboard.howItWorks': {
    en: 'How VoiceLink Works',
    es: 'Cómo Funciona VoiceLink',
    fr: 'Comment Fonctionne VoiceLink',
    de: 'Wie VoiceLink Funktioniert',
    it: 'Come Funziona VoiceLink',
    pt: 'Como o VoiceLink Funciona',
    ja: 'VoiceLinkの仕組み',
    ko: 'VoiceLink 작동 방식',
    zh: 'VoiceLink如何工作'
  },
  'dashboard.uploadAudio': {
    en: 'Upload Audio',
    es: 'Subir Audio',
    fr: 'Télécharger Audio',
    de: 'Audio Hochladen',
    it: 'Carica Audio',
    pt: 'Enviar Áudio',
    ja: 'オーディオをアップロード',
    ko: '오디오 업로드',
    zh: '上传音频'
  },
  'dashboard.uploadAudioDesc': {
    en: 'Drag and drop or select an audio file to start',
    es: 'Arrastra y suelta o selecciona un archivo de audio para comenzar',
    fr: 'Glissez-déposez ou sélectionnez un fichier audio pour commencer',
    de: 'Ziehen Sie eine Audiodatei hierher oder wählen Sie eine aus',
    it: 'Trascina e rilascia o seleziona un file audio per iniziare',
    pt: 'Arraste e solte ou selecione um arquivo de áudio para começar',
    ja: 'オーディオファイルをドラッグ&ドロップまたは選択して開始',
    ko: '오디오 파일을 끌어다 놓거나 선택하여 시작',
    zh: '拖放或选择音频文件开始'
  },
  'dashboard.autoCreateMeeting': {
    en: 'Auto-Create Meeting',
    es: 'Crear Reunión Automáticamente',
    fr: 'Créer Automatiquement une Réunion',
    de: 'Besprechung Automatisch Erstellen',
    it: 'Crea Automaticamente Riunione',
    pt: 'Criar Reunião Automaticamente',
    ja: '自動会議作成',
    ko: '자동 회의 생성',
    zh: '自动创建会议'
  },
  'dashboard.autoCreateMeetingDesc': {
    en: 'VoiceLink automatically creates a meeting record for your audio',
    es: 'VoiceLink crea automáticamente un registro de reunión para tu audio',
    fr: 'VoiceLink crée automatiquement un enregistrement de réunion pour votre audio',
    de: 'VoiceLink erstellt automatisch einen Besprechungsdatensatz für Ihr Audio',
    it: 'VoiceLink crea automaticamente un record della riunione per il tuo audio',
    pt: 'VoiceLink cria automaticamente um registro de reunião para seu áudio',
    ja: 'VoiceLinkは自動的にオーディオの会議記録を作成します',
    ko: 'VoiceLink는 자동으로 오디오에 대한 회의 기록을 생성합니다',
    zh: 'VoiceLink自动为您的音频创建会议记录'
  },
  'dashboard.aiProcessing': {
    en: 'AI Processing',
    es: 'Procesamiento IA',
    fr: 'Traitement IA',
    de: 'KI-Verarbeitung',
    it: 'Elaborazione IA',
    pt: 'Processamento IA',
    ja: 'AI処理',
    ko: 'AI 처리',
    zh: 'AI处理'
  },
  'dashboard.aiProcessingDesc': {
    en: 'Audio is transcribed and analyzed (when processing is enabled)',
    es: 'El audio se transcribe y analiza (cuando el procesamiento está habilitado)',
    fr: 'L\'audio est transcrit et analysé (lorsque le traitement est activé)',
    de: 'Audio wird transkribiert und analysiert (wenn die Verarbeitung aktiviert ist)',
    it: 'L\'audio viene trascritto e analizzato (quando l\'elaborazione è abilitata)',
    pt: 'O áudio é transcrito e analisado (quando o processamento está habilitado)',
    ja: 'オーディオは転写され分析されます（処理が有効な場合）',
    ko: '오디오가 전사되고 분석됩니다 (처리가 활성화된 경우)',
    zh: '音频被转录和分析（当处理启用时）'
  },
  'dashboard.interactiveChat': {
    en: 'Interactive Chat',
    es: 'Chat Interactivo',
    fr: 'Chat Interactif',
    de: 'Interaktiver Chat',
    it: 'Chat Interattiva',
    pt: 'Chat Interativo',
    ja: 'インタラクティブチャット',
    ko: '대화형 채팅',
    zh: '交互式聊天'
  },
  'dashboard.interactiveChatDesc': {
    en: 'Ask questions about your meeting content using AI',
    es: 'Haz preguntas sobre el contenido de tu reunión usando IA',
    fr: 'Posez des questions sur le contenu de votre réunion en utilisant l\'IA',
    de: 'Stellen Sie Fragen zum Inhalt Ihrer Besprechung mit KI',
    it: 'Fai domande sul contenuto della tua riunione usando l\'IA',
    pt: 'Faça perguntas sobre o conteúdo da sua reunião usando IA',
    ja: 'AIを使って会議内容について質問',
    ko: 'AI를 사용하여 회의 내용에 대해 질문',
    zh: '使用AI询问您的会议内容'
  },
  'dashboard.latestMeetingReady': {
    en: '✅ Your latest meeting is ready! Use the chat to ask questions about your audio.',
    es: '✅ ¡Tu última reunión está lista! Usa el chat para hacer preguntas sobre tu audio.',
    fr: '✅ Votre dernière réunion est prête ! Utilisez le chat pour poser des questions sur votre audio.',
    de: '✅ Ihr letztes Meeting ist bereit! Nutzen Sie den Chat, um Fragen zu Ihrem Audio zu stellen.',
    it: '✅ La tua ultima riunione è pronta! Usa la chat per fare domande sul tuo audio.',
    pt: '✅ Sua última reunião está pronta! Use o chat para fazer perguntas sobre seu áudio.',
    ja: '✅ 最新の会議の準備ができました！チャットを使ってオーディオについて質問してください。',
    ko: '✅ 최신 회의가 준비되었습니다! 채팅을 사용하여 오디오에 대해 질문하세요.',
    zh: '✅ 您的最新会议已准备就绪！使用聊天询问有关您音频的问题。'
  },
  'dashboard.quickStats': {
    en: 'Quick Stats',
    es: 'Estadísticas Rápidas',
    fr: 'Statistiques Rapides',
    de: 'Schnelle Statistiken',
    it: 'Statistiche Rapide',
    pt: 'Estatísticas Rápidas',
    ja: 'クイック統計',
    ko: '빠른 통계',
    zh: '快速统计'
  },
  'dashboard.latestMeeting': {
    en: 'Latest Meeting',
    es: 'Última Reunión',
    fr: 'Dernière Réunion',
    de: 'Letzte Besprechung',
    it: 'Ultima Riunione',
    pt: 'Última Reunião',
    ja: '最新の会議',
    ko: '최신 회의',
    zh: '最新会议'
  },
  'dashboard.voiceLinkFeatures': {
    en: 'VoiceLink Features',
    es: 'Características de VoiceLink',
    fr: 'Fonctionnalités VoiceLink',
    de: 'VoiceLink-Funktionen',
    it: 'Funzionalità VoiceLink',
    pt: 'Recursos do VoiceLink',
    ja: 'VoiceLink機能',
    ko: 'VoiceLink 기능',
    zh: 'VoiceLink功能'
  },
  'dashboard.voiceProcessing': {
    en: 'Voice Processing',
    es: 'Procesamiento de Voz',
    fr: 'Traitement Vocal',
    de: 'Sprachverarbeitung',
    it: 'Elaborazione Vocale',
    pt: 'Processamento de Voz',
    ja: '音声処理',
    ko: '음성 처리',
    zh: '语音处理'
  },
  'dashboard.voiceProcessingDesc': {
    en: 'Advanced audio transcription with speaker detection',
    es: 'Transcripción de audio avanzada con detección de hablantes',
    fr: 'Transcription audio avancée avec détection de locuteur',
    de: 'Erweiterte Audio-Transkription mit Sprechererkennung',
    it: 'Trascrizione audio avanzata con rilevamento del parlatore',
    pt: 'Transcrição de áudio avançada com detecção de falante',
    ja: '話者検出付き高度音声転写',
    ko: '화자 감지 기능이 있는 고급 오디오 전사',
    zh: '具有说话者检测的高级音频转录'
  },
  'dashboard.aiAnalysis': {
    en: 'AI Analysis',
    es: 'Análisis IA',
    fr: 'Analyse IA',
    de: 'KI-Analyse',
    it: 'Analisi IA',
    pt: 'Análise IA',
    ja: 'AI分析',
    ko: 'AI 분석',
    zh: 'AI分析'
  },
  'dashboard.aiAnalysisDesc': {
    en: 'Intelligent content analysis and documentation generation',
    es: 'Análisis inteligente de contenido y generación de documentación',
    fr: 'Analyse intelligente du contenu et génération de documentation',
    de: 'Intelligente Inhaltsanalyse und Dokumentationserstellung',
    it: 'Analisi intelligente del contenuto e generazione di documentazione',
    pt: 'Análise inteligente de conteúdo e geração de documentação',
    ja: 'インテリジェントコンテンツ分析とドキュメント生成',
    ko: '지능형 콘텐츠 분석 및 문서 생성',
    zh: '智能内容分析和文档生成'
  },
  'dashboard.blockchainVerified': {
    en: 'Blockchain Verified',
    es: 'Verificado por Blockchain',
    fr: 'Vérifié par Blockchain',
    de: 'Blockchain-Verifiziert',
    it: 'Verificato Blockchain',
    pt: 'Verificado por Blockchain',
    ja: 'ブロックチェーン検証済み',
    ko: '블록체인 검증됨',
    zh: '区块链验证'
  },
  'dashboard.blockchainVerifiedDesc': {
    en: 'Cryptographic verification and secure content storage',
    es: 'Verificación criptográfica y almacenamiento seguro de contenido',
    fr: 'Vérification cryptographique et stockage sécurisé du contenu',
    de: 'Kryptographische Verifizierung und sichere Inhaltsspeicherung',
    it: 'Verifica crittografica e archiviazione sicura dei contenuti',
    pt: 'Verificação criptográfica e armazenamento seguro de conteúdo',
    ja: '暗号化検証と安全なコンテンツストレージ',
    ko: '암호화 검증 및 보안 콘텐츠 저장',
    zh: '加密验证和安全内容存储'
  },

  // Meeting Dashboard
  'meetings.title': {
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
  'meetings.createMeeting': {
    en: 'Create Meeting',
    es: 'Crear Reunión',
    fr: 'Créer une Réunion',
    de: 'Besprechung Erstellen',
    it: 'Crea Riunione',
    pt: 'Criar Reunião',
    ja: '会議を作成',
    ko: '회의 생성',
    zh: '创建会议'
  },
  'meetings.error': {
    en: 'Error',
    es: 'Error',
    fr: 'Erreur',
    de: 'Fehler',
    it: 'Errore',
    pt: 'Erro',
    ja: 'エラー',
    ko: '오류',
    zh: '错误'
  },
  'meetings.dismiss': {
    en: 'Dismiss',
    es: 'Descartar',
    fr: 'Ignorer',
    de: 'Verwerfen',
    it: 'Ignora',
    pt: 'Dispensar',
    ja: '却下',
    ko: '무시',
    zh: '忽略'
  },
  'meetings.allMeetings': {
    en: 'All Meetings',
    es: 'Todas las Reuniones',
    fr: 'Toutes les Réunions',
    de: 'Alle Besprechungen',
    it: 'Tutte le Riunioni',
    pt: 'Todas as Reuniões',
    ja: 'すべての会議',
    ko: '모든 회의',
    zh: '所有会议'
  },
  'meetings.scheduled': {
    en: 'Scheduled',
    es: 'Programada',
    fr: 'Programmée',
    de: 'Geplant',
    it: 'Programmata',
    pt: 'Agendada',
    ja: '予定済み',
    ko: '예정됨',
    zh: '已安排'
  },
  'meetings.active': {
    en: 'Active',
    es: 'Activa',
    fr: 'Active',
    de: 'Aktiv',
    it: 'Attiva',
    pt: 'Ativa',
    ja: 'アクティブ',
    ko: '활성',
    zh: '活跃'
  },
  'meetings.paused': {
    en: 'Paused',
    es: 'Pausada',
    fr: 'En Pause',
    de: 'Pausiert',
    it: 'In Pausa',
    pt: 'Pausada',
    ja: '一時停止',
    ko: '일시정지',
    zh: '暂停'
  },
  'meetings.completed': {
    en: 'Completed',
    es: 'Completada',
    fr: 'Terminée',
    de: 'Abgeschlossen',
    it: 'Completata',
    pt: 'Concluída',
    ja: '完了',
    ko: '완료',
    zh: '已完成'
  },
  'meetings.cancelled': {
    en: 'Cancelled',
    es: 'Cancelada',
    fr: 'Annulée',
    de: 'Abgesagt',
    it: 'Annullata',
    pt: 'Cancelada',
    ja: 'キャンセル',
    ko: '취소됨',
    zh: '已取消'
  },
  'meetings.refresh': {
    en: 'Refresh',
    es: 'Actualizar',
    fr: 'Actualiser',
    de: 'Aktualisieren',
    it: 'Aggiorna',
    pt: 'Atualizar',
    ja: '更新',
    ko: '새로고침',
    zh: '刷新'
  },
  'meetings.noMeetingsFound': {
    en: 'No meetings found',
    es: 'No se encontraron reuniones',
    fr: 'Aucune réunion trouvée',
    de: 'Keine Besprechungen gefunden',
    it: 'Nessuna riunione trovata',
    pt: 'Nenhuma reunião encontrada',
    ja: '会議が見つかりません',
    ko: '회의를 찾을 수 없음',
    zh: '未找到会议'
  },
  'meetings.noFilteredMeetings': {
    en: 'No {filter} meetings found',
    es: 'No se encontraron reuniones {filter}',
    fr: 'Aucune réunion {filter} trouvée',
    de: 'Keine {filter} Besprechungen gefunden',
    it: 'Nessuna riunione {filter} trovata',
    pt: 'Nenhuma reunião {filter} encontrada',
    ja: '{filter}会議が見つかりません',
    ko: '{filter} 회의를 찾을 수 없음',
    zh: '未找到{filter}会议'
  },
  'meetings.createFirstMeeting': {
    en: 'Create your first meeting to get started',
    es: 'Crea tu primera reunión para comenzar',
    fr: 'Créez votre première réunion pour commencer',
    de: 'Erstellen Sie Ihre erste Besprechung, um zu beginnen',
    it: 'Crea la tua prima riunione per iniziare',
    pt: 'Crie sua primeira reunião para começar',
    ja: '最初の会議を作成して開始',
    ko: '시작하려면 첫 번째 회의를 만드세요',
    zh: '创建您的第一个会议开始'
  },
  'meetings.createFirstMeetingBtn': {
    en: 'Create First Meeting',
    es: 'Crear Primera Reunión',
    fr: 'Créer la Première Réunion',
    de: 'Erste Besprechung Erstellen',
    it: 'Crea Prima Riunione',
    pt: 'Criar Primeira Reunião',
    ja: '最初の会議を作成',
    ko: '첫 번째 회의 생성',
    zh: '创建第一个会议'
  },
  'meetings.loadingMeetings': {
    en: 'Loading meetings...',
    es: 'Cargando reuniones...',
    fr: 'Chargement des réunions...',
    de: 'Besprechungen werden geladen...',
    it: 'Caricamento riunioni...',
    pt: 'Carregando reuniões...',
    ja: '会議を読み込み中...',
    ko: '회의 로딩 중...',
    zh: '正在加载会议...'
  },
  'meetings.participants': {
    en: 'participants',
    es: 'participantes',
    fr: 'participants',
    de: 'Teilnehmer',
    it: 'partecipanti',
    pt: 'participantes',
    ja: '参加者',
    ko: '참가자',
    zh: '参与者'
  },
  'meetings.minutes': {
    en: 'min',
    es: 'min',
    fr: 'min',
    de: 'min',
    it: 'min',
    pt: 'min',
    ja: '分',
    ko: '분',
    zh: '分钟'
  },
  'meetings.startMeeting': {
    en: 'Start Meeting',
    es: 'Iniciar Reunión',
    fr: 'Démarrer la Réunion',
    de: 'Besprechung Starten',
    it: 'Inizia Riunione',
    pt: 'Iniciar Reunião',
    ja: '会議を開始',
    ko: '회의 시작',
    zh: '开始会议'
  },
  'meetings.pause': {
    en: 'Pause',
    es: 'Pausar',
    fr: 'Pause',
    de: 'Pausieren',
    it: 'Pausa',
    pt: 'Pausar',
    ja: '一時停止',
    ko: '일시정지',
    zh: '暂停'
  },
  'meetings.endMeeting': {
    en: 'End Meeting',
    es: 'Finalizar Reunión',
    fr: 'Terminer la Réunion',
    de: 'Besprechung Beenden',
    it: 'Termina Riunione',
    pt: 'Encerrar Reunião',
    ja: '会議を終了',
    ko: '회의 종료',
    zh: '结束会议'
  },
  'meetings.resume': {
    en: 'Resume',
    es: 'Reanudar',
    fr: 'Reprendre',
    de: 'Fortsetzen',
    it: 'Riprendi',
    pt: 'Retomar',
    ja: '再開',
    ko: '재개',
    zh: '恢复'
  },
  'meetings.meetingCompleted': {
    en: 'Meeting completed',
    es: 'Reunión completada',
    fr: 'Réunion terminée',
    de: 'Besprechung abgeschlossen',
    it: 'Riunione completata',
    pt: 'Reunião concluída',
    ja: '会議完了',
    ko: '회의 완료',
    zh: '会议已完成'
  },
  'meetings.viewDetails': {
    en: 'View Details',
    es: 'Ver Detalles',
    fr: 'Voir les Détails',
    de: 'Details Anzeigen',
    it: 'Visualizza Dettagli',
    pt: 'Ver Detalhes',
    ja: '詳細を表示',
    ko: '세부사항 보기',
    zh: '查看详情'
  },
  'meetings.detailedView': {
    en: 'Detailed View',
    es: 'Vista Detallada',
    fr: 'Vue Détaillée',
    de: 'Detailansicht',
    it: 'Vista Dettagliata',
    pt: 'Visualização Detalhada',
    ja: '詳細ビュー',
    ko: '상세 보기',
    zh: '详细视图'
  },

  // Common UI elements
  'common.tryAgain': {
    en: 'Try again',
    es: 'Intentar de nuevo',
    fr: 'Réessayer',
    de: 'Erneut versuchen',
    it: 'Riprova',
    pt: 'Tentar novamente',
    ja: '再試行',
    ko: '다시 시도',
    zh: '重试'
  },
  'common.loading': {
    en: 'Loading...',
    es: 'Cargando...',
    fr: 'Chargement...',
    de: 'Wird geladen...',
    it: 'Caricamento...',
    pt: 'Carregando...',
    ja: '読み込み中...',
    ko: '로딩 중...',
    zh: '加载中...'
  },
  'common.error': {
    en: 'Error',
    es: 'Error',
    fr: 'Erreur',
    de: 'Fehler',
    it: 'Errore',
    pt: 'Erro',
    ja: 'エラー',
    ko: '오류',
    zh: '错误'
  },
  'common.success': {
    en: 'Success',
    es: 'Éxito',
    fr: 'Succès',
    de: 'Erfolg',
    it: 'Successo',
    pt: 'Sucesso',
    ja: '成功',
    ko: '성공',
    zh: '成功'
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
  },
  'common.save': {
    en: 'Save',
    es: 'Guardar',
    fr: 'Enregistrer',
    de: 'Speichern',
    it: 'Salva',
    pt: 'Salvar',
    ja: '保存',
    ko: '저장',
    zh: '保存'
  },
  'common.close': {
    en: 'Close',
    es: 'Cerrar',
    fr: 'Fermer',
    de: 'Schließen',
    it: 'Chiudi',
    pt: 'Fechar',
    ja: '閉じる',
    ko: '닫기',
    zh: '关闭'
  },

  // Create Meeting Modal
  'createMeeting.title': {
    en: 'Create New Meeting',
    es: 'Crear Nueva Reunión',
    fr: 'Créer une Nouvelle Réunion',
    de: 'Neue Besprechung Erstellen',
    it: 'Crea Nuova Riunione',
    pt: 'Criar Nova Reunião',
    ja: '新しい会議を作成',
    ko: '새 회의 생성',
    zh: '创建新会议'
  },
  'createMeeting.meetingTitle': {
    en: 'Meeting Title',
    es: 'Título de la Reunión',
    fr: 'Titre de la Réunion',
    de: 'Besprechungstitel',
    it: 'Titolo della Riunione',
    pt: 'Título da Reunião',
    ja: '会議タイトル',
    ko: '회의 제목',
    zh: '会议标题'
  },
  'createMeeting.description': {
    en: 'Description',
    es: 'Descripción',
    fr: 'Description',
    de: 'Beschreibung',
    it: 'Descrizione',
    pt: 'Descrição',
    ja: '説明',
    ko: '설명',
    zh: '描述'
  },
  'createMeeting.titlePlaceholder': {
    en: 'Enter meeting title...',
    es: 'Ingrese el título de la reunión...',
    fr: 'Entrez le titre de la réunion...',
    de: 'Besprechungstitel eingeben...',
    it: 'Inserisci il titolo della riunione...',
    pt: 'Digite o título da reunião...',
    ja: '会議タイトルを入力...',
    ko: '회의 제목을 입력하세요...',
    zh: '输入会议标题...'
  },
  'createMeeting.descriptionPlaceholder': {
    en: 'Optional meeting description...',
    es: 'Descripción opcional de la reunión...',
    fr: 'Description facultative de la réunion...',
    de: 'Optionale Besprechungsbeschreibung...',
    it: 'Descrizione opzionale della riunione...',
    pt: 'Descrição opcional da reunião...',
    ja: 'オプションの会議説明...',
    ko: '선택적 회의 설명...',
    zh: '可选会议描述...'
  },
  'createMeeting.titleRequired': {
    en: 'Meeting title is required',
    es: 'El título de la reunión es obligatorio',
    fr: 'Le titre de la réunion est requis',
    de: 'Besprechungstitel ist erforderlich',
    it: 'Il titolo della riunione è obbligatorio',
    pt: 'O título da reunião é obrigatório',
    ja: '会議タイトルは必須です',
    ko: '회의 제목은 필수입니다',
    zh: '会议标题是必需的'
  },
  'createMeeting.titleMinLength': {
    en: 'Meeting title must be at least 3 characters',
    es: 'El título de la reunión debe tener al menos 3 caracteres',
    fr: 'Le titre de la réunion doit comporter au moins 3 caractères',
    de: 'Besprechungstitel muss mindestens 3 Zeichen haben',
    it: 'Il titolo della riunione deve avere almeno 3 caratteri',
    pt: 'O título da reunião deve ter pelo menos 3 caracteres',
    ja: '会議タイトルは少なくとも3文字である必要があります',
    ko: '회의 제목은 최소 3자 이상이어야 합니다',
    zh: '会议标题至少需要3个字符'
  },
  'createMeeting.invalidEmail': {
    en: 'Please enter a valid email address',
    es: 'Por favor, ingrese una dirección de correo válida',
    fr: 'Veuillez entrer une adresse e-mail valide',
    de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    it: 'Si prega di inserire un indirizzo email valido',
    pt: 'Por favor, insira um endereço de email válido',
    ja: '有効なメールアドレスを入力してください',
    ko: '유효한 이메일 주소를 입력하세요',
    zh: '请输入有效的电子邮件地址'
  },
  'createMeeting.participantExists': {
    en: 'This participant is already added',
    es: 'Este participante ya fue agregado',
    fr: 'Ce participant est déjà ajouté',
    de: 'Dieser Teilnehmer wurde bereits hinzugefügt',
    it: 'Questo partecipante è già stato aggiunto',
    pt: 'Este participante já foi adicionado',
    ja: 'この参加者は既に追加されています',
    ko: '이 참가자는 이미 추가되었습니다',
    zh: '此参与者已添加'
  },

  // Audio Uploader
  'uploader.dropAudioHere': {
    en: 'Drop your audio file here or click to browse',
    es: 'Suelta tu archivo de audio aquí o haz clic para explorar',
    fr: 'Déposez votre fichier audio ici ou cliquez pour parcourir',
    de: 'Audio-Datei hier ablegen oder klicken zum Durchsuchen',
    it: 'Rilascia il tuo file audio qui o clicca per sfogliare',
    pt: 'Solte seu arquivo de áudio aqui ou clique para navegar',
    ja: 'オーディオファイルをここにドロップするかクリックして参照',
    ko: '오디오 파일을 여기에 놓거나 클릭하여 찾아보기',
    zh: '将音频文件拖放到这里或点击浏览'
  },
  'uploader.supportsFormats': {
    en: 'Supports {formats} • Max size: 100MB',
    es: 'Soporta {formats} • Tamaño máx: 100MB',
    fr: 'Prend en charge {formats} • Taille max: 100MB',
    de: 'Unterstützt {formats} • Max. Größe: 100MB',
    it: 'Supporta {formats} • Dimensione max: 100MB',
    pt: 'Suporta {formats} • Tamanho máx: 100MB',
    ja: '{formats}をサポート • 最大サイズ: 100MB',
    ko: '{formats} 지원 • 최대 크기: 100MB',
    zh: '支持{formats} • 最大大小：100MB'
  },
  'uploader.autoCreateMeeting': {
    en: '✨ A meeting will be automatically created from your audio file',
    es: '✨ Se creará automáticamente una reunión desde tu archivo de audio',
    fr: '✨ Une réunion sera automatiquement créée à partir de votre fichier audio',
    de: '✨ Ein Meeting wird automatisch aus Ihrer Audio-Datei erstellt',
    it: '✨ Una riunione verrà creata automaticamente dal tuo file audio',
    pt: '✨ Uma reunião será criada automaticamente do seu arquivo de áudio',
    ja: '✨ オーディオファイルから自動的に会議が作成されます',
    ko: '✨ 오디오 파일에서 자동으로 회의가 생성됩니다',
    zh: '✨ 将从您的音频文件自动创建会议'
  },
  'uploader.uploading': {
    en: 'Uploading audio file...',
    es: 'Subiendo archivo de audio...',
    fr: 'Téléchargement du fichier audio...',
    de: 'Audio-Datei wird hochgeladen...',
    it: 'Caricamento file audio...',
    pt: 'Enviando arquivo de áudio...',
    ja: 'オーディオファイルをアップロード中...',
    ko: '오디오 파일 업로드 중...',
    zh: '正在上传音频文件...'
  },
  'uploader.creatingMeeting': {
    en: 'Creating meeting from audio file...',
    es: 'Creando reunión desde archivo de audio...',
    fr: 'Création de réunion à partir du fichier audio...',
    de: 'Meeting wird aus Audio-Datei erstellt...',
    it: 'Creazione riunione da file audio...',
    pt: 'Criando reunião do arquivo de áudio...',
    ja: 'オーディオファイルから会議を作成中...',
    ko: '오디오 파일에서 회의 생성 중...',
    zh: '从音频文件创建会议中...'
  },
  'uploader.uploadComplete': {
    en: 'Upload complete!',
    es: '¡Subida completa!',
    fr: 'Téléchargement terminé !',
    de: 'Upload abgeschlossen!',
    it: 'Caricamento completato!',
    pt: 'Upload concluído!',
    ja: 'アップロード完了！',
    ko: '업로드 완료!',
    zh: '上传完成！'
  },
  'uploader.processingFailed': {
    en: 'Processing failed',
    es: 'Error en el procesamiento',
    fr: 'Échec du traitement',
    de: 'Verarbeitung fehlgeschlagen',
    it: 'Elaborazione fallita',
    pt: 'Processamento falhou',
    ja: '処理に失敗しました',
    ko: '처리 실패',
    zh: '处理失败'
  },
  'uploader.meetingCreatedSuccess': {
    en: 'Meeting created successfully!',
    es: '¡Reunión creada exitosamente!',
    fr: 'Réunion créée avec succès !',
    de: 'Meeting erfolgreich erstellt!',
    it: 'Riunione creata con successo!',
    pt: 'Reunião criada com sucesso!',
    ja: '会議が正常に作成されました！',
    ko: '회의가 성공적으로 생성되었습니다!',
    zh: '会议创建成功！'
  },
  'uploader.meetingDetails': {
    en: 'Meeting Details:',
    es: 'Detalles de la Reunión:',
    fr: 'Détails de la Réunion :',
    de: 'Meeting-Details:',
    it: 'Dettagli della Riunione:',
    pt: 'Detalhes da Reunião:',
    ja: '会議の詳細：',
    ko: '회의 세부사항:',
    zh: '会议详情：'
  },
  'uploader.title': {
    en: 'Title:',
    es: 'Título:',
    fr: 'Titre :',
    de: 'Titel:',
    it: 'Titolo:',
    pt: 'Título:',
    ja: 'タイトル：',
    ko: '제목:',
    zh: '标题：'
  },
  'uploader.meetingId': {
    en: 'Meeting ID:',
    es: 'ID de Reunión:',
    fr: 'ID de Réunion :',
    de: 'Meeting-ID:',
    it: 'ID Riunione:',
    pt: 'ID da Reunião:',
    ja: '会議ID：',
    ko: '회의 ID:',
    zh: '会议ID：'
  },
  'uploader.status': {
    en: 'Status:',
    es: 'Estado:',
    fr: 'Statut :',
    de: 'Status:',
    it: 'Stato:',
    pt: 'Status:',
    ja: 'ステータス：',
    ko: '상태:',
    zh: '状态：'
  },
  'uploader.fileId': {
    en: 'File ID:',
    es: 'ID de Archivo:',
    fr: 'ID de Fichier :',
    de: 'Datei-ID:',
    it: 'ID File:',
    pt: 'ID do Arquivo:',
    ja: 'ファイルID：',
    ko: '파일 ID:',
    zh: '文件ID：'
  },
  'uploader.viewMeeting': {
    en: 'View Meeting',
    es: 'Ver Reunión',
    fr: 'Voir la Réunion',
    de: 'Meeting Anzeigen',
    it: 'Visualizza Riunione',
    pt: 'Ver Reunião',
    ja: '会議を表示',
    ko: '회의 보기',
    zh: '查看会议'
  },
  'uploader.askQuestions': {
    en: 'Ask Questions',
    es: 'Hacer Preguntas',
    fr: 'Poser des Questions',
    de: 'Fragen Stellen',
    it: 'Fai Domande',
    pt: 'Fazer Perguntas',
    ja: '質問する',
    ko: '질문하기',
    zh: '提问'
  },
  'uploader.allMeetings': {
    en: 'All Meetings',
    es: 'Todas las Reuniones',
    fr: 'Toutes les Réunions',
    de: 'Alle Meetings',
    it: 'Tutte le Riunioni',
    pt: 'Todas as Reuniões',
    ja: 'すべての会議',
    ko: '모든 회의',
    zh: '所有会议'
  },
  'uploader.newWorkflow': {
    en: '💡 New Workflow: Upload → Auto-create meeting → View results → Chat about content',
    es: '💡 Nuevo Flujo: Subir → Auto-crear reunión → Ver resultados → Chatear sobre contenido',
    fr: '💡 Nouveau Flux : Télécharger → Créer automatiquement une réunion → Voir les résultats → Discuter du contenu',
    de: '💡 Neuer Workflow: Upload → Auto-Meeting erstellen → Ergebnisse anzeigen → Über Inhalte chatten',
    it: '💡 Nuovo Flusso: Carica → Crea automaticamente riunione → Visualizza risultati → Chatta sui contenuti',
    pt: '💡 Novo Fluxo: Upload → Criar reunião automaticamente → Ver resultados → Conversar sobre conteúdo',
    ja: '💡 新しいワークフロー：アップロード → 自動会議作成 → 結果表示 → コンテンツについてチャット',
    ko: '💡 새 워크플로: 업로드 → 자동 회의 생성 → 결과 보기 → 콘텐츠에 대해 채팅',
    zh: '💡 新工作流程：上传 → 自动创建会议 → 查看结果 → 讨论内容'
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
  'settings.description': {
    en: 'Configure VoiceLink to match your workflow and preferences.',
    es: 'Configura VoiceLink para adaptarse a tu flujo de trabajo y preferencias.',
    fr: 'Configurez VoiceLink pour correspondre à votre flux de travail et vos préférences.',
    de: 'Konfigurieren Sie VoiceLink passend zu Ihrem Arbeitsablauf und Ihren Vorlieben.',
    it: 'Configura VoiceLink per adattarlo al tuo flusso di lavoro e alle tue preferenze.',
    pt: 'Configure o VoiceLink para combinar com seu fluxo de trabalho e preferências.',
    ja: 'ワークフローと設定に合わせてVoiceLinkを設定してください。',
    ko: '워크플로우와 환경설정에 맞게 VoiceLink를 구성하세요.',
    zh: '配置VoiceLink以匹配您的工作流程和偏好。'
  },

  // API Settings
  'settings.apiConfiguration': {
    en: '🔗 API Configuration',
    es: '🔗 Configuración de API',
    fr: '🔗 Configuration API',
    de: '🔗 API-Konfiguration',
    it: '🔗 Configurazione API',
    pt: '🔗 Configuração da API',
    ja: '🔗 API設定',
    ko: '🔗 API 설정',
    zh: '🔗 API配置'
  },
  'settings.apiBaseUrl': {
    en: 'API Base URL',
    es: 'URL Base de la API',
    fr: 'URL de Base de l\'API',
    de: 'API-Basis-URL',
    it: 'URL Base dell\'API',
    pt: 'URL Base da API',
    ja: 'APIベースURL',
    ko: 'API 기본 URL',
    zh: 'API基础URL'
  },
  'settings.apiBaseUrlDescription': {
    en: 'Base URL for the VoiceLink API server',
    es: 'URL base para el servidor API de VoiceLink',
    fr: 'URL de base pour le serveur API VoiceLink',
    de: 'Basis-URL für den VoiceLink API-Server',
    it: 'URL base per il server API VoiceLink',
    pt: 'URL base para o servidor da API VoiceLink',
    ja: 'VoiceLink APIサーバーのベースURL',
    ko: 'VoiceLink API 서버의 기본 URL',
    zh: 'VoiceLink API服务器的基础URL'
  },
  'settings.requestTimeout': {
    en: 'Request Timeout (ms)',
    es: 'Tiempo de Espera de Solicitud (ms)',
    fr: 'Délai d\'Attente de Requête (ms)',
    de: 'Anfrage-Timeout (ms)',
    it: 'Timeout Richiesta (ms)',
    pt: 'Timeout de Solicitação (ms)',
    ja: 'リクエストタイムアウト（ms）',
    ko: '요청 타임아웃 (ms)',
    zh: '请求超时（毫秒）'
  },
  'settings.requestTimeoutDescription': {
    en: 'Maximum time to wait for API responses',
    es: 'Tiempo máximo para esperar respuestas de la API',
    fr: 'Temps maximum d\'attente pour les réponses API',
    de: 'Maximale Wartezeit für API-Antworten',
    it: 'Tempo massimo di attesa per le risposte API',
    pt: 'Tempo máximo para aguardar respostas da API',
    ja: 'API応答の最大待機時間',
    ko: 'API 응답을 기다리는 최대 시간',
    zh: '等待API响应的最长时间'
  },

  // Processing Settings
  'settings.processingOptions': {
    en: '⚡ Processing Options',
    es: '⚡ Opciones de Procesamiento',
    fr: '⚡ Options de Traitement',
    de: '⚡ Verarbeitungsoptionen',
    it: '⚡ Opzioni di Elaborazione',
    pt: '⚡ Opções de Processamento',
    ja: '⚡ 処理オプション',
    ko: '⚡ 처리 옵션',
    zh: '⚡ 处理选项'
  },
  'settings.audioQuality': {
    en: 'Audio Quality',
    es: 'Calidad de Audio',
    fr: 'Qualité Audio',
    de: 'Audioqualität',
    it: 'Qualità Audio',
    pt: 'Qualidade do Áudio',
    ja: 'オーディオ品質',
    ko: '오디오 품질',
    zh: '音频质量'
  },
  'settings.audioQualityLow': {
    en: 'Low (Faster processing)',
    es: 'Baja (Procesamiento más rápido)',
    fr: 'Faible (Traitement plus rapide)',
    de: 'Niedrig (Schnellere Verarbeitung)',
    it: 'Bassa (Elaborazione più veloce)',
    pt: 'Baixa (Processamento mais rápido)',
    ja: '低（高速処理）',
    ko: '낮음 (빠른 처리)',
    zh: '低（处理更快）'
  },
  'settings.audioQualityMedium': {
    en: 'Medium (Balanced)',
    es: 'Media (Equilibrado)',
    fr: 'Moyen (Équilibré)',
    de: 'Mittel (Ausgewogen)',
    it: 'Media (Bilanciata)',
    pt: 'Média (Equilibrada)',
    ja: '中（バランス）',
    ko: '보통 (균형)',
    zh: '中等（平衡）'
  },
  'settings.audioQualityHigh': {
    en: 'High (Best accuracy)',
    es: 'Alta (Mejor precisión)',
    fr: 'Élevée (Meilleure précision)',
    de: 'Hoch (Beste Genauigkeit)',
    it: 'Alta (Migliore accuratezza)',
    pt: 'Alta (Melhor precisão)',
    ja: '高（最高精度）',
    ko: '높음 (최고 정확도)',
    zh: '高（最佳准确性）'
  },
  'settings.audioQualityDescription': {
    en: 'Higher quality provides better transcription accuracy but takes longer',
    es: 'Mayor calidad proporciona mejor precisión de transcripción pero toma más tiempo',
    fr: 'Une qualité supérieure améliore la précision de transcription mais prend plus de temps',
    de: 'Höhere Qualität bietet bessere Transkriptionsgenauigkeit, dauert aber länger',
    it: 'Una qualità superiore offre migliore accuratezza di trascrizione ma richiede più tempo',
    pt: 'Qualidade superior oferece melhor precisão de transcrição mas leva mais tempo',
    ja: '高品質はより良い転写精度を提供しますが、時間がかかります',
    ko: '더 높은 품질은 더 나은 전사 정확도를 제공하지만 시간이 더 걸립니다',
    zh: '更高质量提供更好的转录准确性但需要更长时间'
  },
  'settings.speakerDetection': {
    en: 'Enable Speaker Detection',
    es: 'Habilitar Detección de Oradores',
    fr: 'Activer la Détection de Locuteurs',
    de: 'Sprechererkennung Aktivieren',
    it: 'Abilita Rilevamento Oratori',
    pt: 'Ativar Detecção de Falantes',
    ja: '話者検出を有効にする',
    ko: '화자 감지 활성화',
    zh: '启用说话人检测'
  },
  'settings.speakerDetectionDescription': {
    en: 'Identify and separate different speakers in the audio',
    es: 'Identificar y separar diferentes oradores en el audio',
    fr: 'Identifier et séparer différents locuteurs dans l\'audio',
    de: 'Verschiedene Sprecher im Audio identifizieren und trennen',
    it: 'Identificare e separare diversi oratori nell\'audio',
    pt: 'Identificar e separar diferentes falantes no áudio',
    ja: 'オーディオ内の異なる話者を識別して分離',
    ko: '오디오에서 다른 화자를 식별하고 분리',
    zh: '识别和分离音频中的不同说话人'
  },
  'settings.codeDetection': {
    en: 'Enable Code Context Detection',
    es: 'Habilitar Detección de Contexto de Código',
    fr: 'Activer la Détection de Contexte de Code',
    de: 'Code-Kontext-Erkennung Aktivieren',
    it: 'Abilita Rilevamento Contesto Codice',
    pt: 'Ativar Detecção de Contexto de Código',
    ja: 'コードコンテキスト検出を有効にする',
    ko: '코드 컨텍스트 감지 활성화',
    zh: '启用代码上下文检测'
  },
  'settings.codeDetectionDescription': {
    en: 'Detect mentions of GitHub issues, PRs, and technical terms',
    es: 'Detectar menciones de issues de GitHub, PRs y términos técnicos',
    fr: 'Détecter les mentions d\'issues GitHub, PR et termes techniques',
    de: 'Erwähnungen von GitHub-Issues, PRs und technischen Begriffen erkennen',
    it: 'Rilevare menzioni di issue GitHub, PR e termini tecnici',
    pt: 'Detectar menções de issues do GitHub, PRs e termos técnicos',
    ja: 'GitHubのissue、PR、技術用語の言及を検出',
    ko: 'GitHub 이슈, PR, 기술 용어의 언급 감지',
    zh: '检测GitHub问题、PR和技术术语的提及'
  },

  // Accessibility Settings
  'settings.accessibility': {
    en: '♿ Accessibility',
    es: '♿ Accesibilidad',
    fr: '♿ Accessibilité',
    de: '♿ Barrierefreiheit',
    it: '♿ Accessibilità',
    pt: '♿ Acessibilidade',
    ja: '♿ アクセシビリティ',
    ko: '♿ 접근성',
    zh: '♿ 无障碍功能'
  },
  'settings.highContrastMode': {
    en: 'High Contrast Mode',
    es: 'Modo de Alto Contraste',
    fr: 'Mode Haut Contraste',
    de: 'Hoher Kontrast-Modus',
    it: 'Modalità Alto Contrasto',
    pt: 'Modo de Alto Contraste',
    ja: 'ハイコントラストモード',
    ko: '고대비 모드',
    zh: '高对比度模式'
  },
  'settings.highContrastDescription': {
    en: 'Increase contrast for better visibility',
    es: 'Aumentar el contraste para mejor visibilidad',
    fr: 'Augmenter le contraste pour une meilleure visibilité',
    de: 'Kontrast für bessere Sichtbarkeit erhöhen',
    it: 'Aumentare il contrasto per migliore visibilità',
    pt: 'Aumentar o contraste para melhor visibilidade',
    ja: 'より良い可視性のためにコントラストを上げる',
    ko: '더 나은 가시성을 위해 대비 증가',
    zh: '增加对比度以获得更好的可见性'
  },
  'settings.reduceMotion': {
    en: 'Reduce Motion',
    es: 'Reducir Movimiento',
    fr: 'Réduire le Mouvement',
    de: 'Bewegung Reduzieren',
    it: 'Riduci Movimento',
    pt: 'Reduzir Movimento',
    ja: 'モーション削減',
    ko: '모션 줄이기',
    zh: '减少动效'
  },
  'settings.reduceMotionDescription': {
    en: 'Minimize animations and transitions',
    es: 'Minimizar animaciones y transiciones',
    fr: 'Minimiser les animations et transitions',
    de: 'Animationen und Übergänge minimieren',
    it: 'Minimizzare animazioni e transizioni',
    pt: 'Minimizar animações e transições',
    ja: 'アニメーションとトランジションを最小化',
    ko: '애니메이션과 전환 최소화',
    zh: '最小化动画和过渡效果'
  },
  'settings.fontSize': {
    en: 'Font Size',
    es: 'Tamaño de Fuente',
    fr: 'Taille de Police',
    de: 'Schriftgröße',
    it: 'Dimensione Font',
    pt: 'Tamanho da Fonte',
    ja: 'フォントサイズ',
    ko: '글꼴 크기',
    zh: '字体大小'
  },
  'settings.fontSizeSmall': {
    en: 'Small',
    es: 'Pequeña',
    fr: 'Petite',
    de: 'Klein',
    it: 'Piccola',
    pt: 'Pequena',
    ja: '小',
    ko: '작게',
    zh: '小'
  },
  'settings.fontSizeMedium': {
    en: 'Medium',
    es: 'Mediana',
    fr: 'Moyenne',
    de: 'Mittel',
    it: 'Media',
    pt: 'Média',
    ja: '中',
    ko: '보통',
    zh: '中等'
  },
  'settings.fontSizeLarge': {
    en: 'Large',
    es: 'Grande',
    fr: 'Grande',
    de: 'Groß',
    it: 'Grande',
    pt: 'Grande',
    ja: '大',
    ko: '크게',
    zh: '大'
  },
  'settings.fontSizeExtraLarge': {
    en: 'Extra Large',
    es: 'Extra Grande',
    fr: 'Très Grande',
    de: 'Extra Groß',
    it: 'Extra Grande',
    pt: 'Extra Grande',
    ja: '特大',
    ko: '매우 크게',
    zh: '特大'
  },
  'settings.fontSizeDescription': {
    en: 'Adjust text size for better readability',
    es: 'Ajustar el tamaño del texto para mejor legibilidad',
    fr: 'Ajuster la taille du texte pour une meilleure lisibilité',
    de: 'Textgröße für bessere Lesbarkeit anpassen',
    it: 'Regolare la dimensione del testo per migliore leggibilità',
    pt: 'Ajustar o tamanho do texto para melhor legibilidade',
    ja: 'より良い読みやすさのためにテキストサイズを調整',
    ko: '더 나은 가독성을 위해 텍스트 크기 조정',
    zh: '调整文本大小以获得更好的可读性'
  },

  // Integrations
  'settings.integrations': {
    en: '🔌 Integrations',
    es: '🔌 Integraciones',
    fr: '🔌 Intégrations',
    de: '🔌 Integrationen',
    it: '🔌 Integrazioni',
    pt: '🔌 Integrações',
    ja: '🔌 統合',
    ko: '🔌 통합',
    zh: '🔌 集成'
  },
  'settings.githubIntegration': {
    en: 'Enable GitHub Integration',
    es: 'Habilitar Integración con GitHub',
    fr: 'Activer l\'Intégration GitHub',
    de: 'GitHub-Integration Aktivieren',
    it: 'Abilita Integrazione GitHub',
    pt: 'Ativar Integração com GitHub',
    ja: 'GitHub統合を有効にする',
    ko: 'GitHub 통합 활성화',
    zh: '启用GitHub集成'
  },
  'settings.githubIntegrationDescription': {
    en: 'Connect with GitHub to detect issue and PR references',
    es: 'Conectar con GitHub para detectar referencias de issues y PRs',
    fr: 'Se connecter à GitHub pour détecter les références d\'issues et PR',
    de: 'Mit GitHub verbinden, um Issue- und PR-Referenzen zu erkennen',
    it: 'Connetti con GitHub per rilevare riferimenti a issue e PR',
    pt: 'Conectar com GitHub para detectar referências de issues e PRs',
    ja: 'GitHubに接続してissueとPRの参照を検出',
    ko: 'GitHub에 연결하여 이슈 및 PR 참조 감지',
    zh: '连接GitHub以检测问题和PR引用'
  },
  'settings.githubToken': {
    en: 'GitHub Personal Access Token',
    es: 'Token de Acceso Personal de GitHub',
    fr: 'Jeton d\'Accès Personnel GitHub',
    de: 'GitHub Personal Access Token',
    it: 'Token di Accesso Personale GitHub',
    pt: 'Token de Acesso Pessoal do GitHub',
    ja: 'GitHub個人アクセストークン',
    ko: 'GitHub 개인 액세스 토큰',
    zh: 'GitHub个人访问令牌'
  },
  'settings.githubTokenDescription': {
    en: 'Required for private repository access',
    es: 'Requerido para acceso a repositorios privados',
    fr: 'Requis pour l\'accès aux dépôts privés',
    de: 'Erforderlich für den Zugriff auf private Repositories',
    it: 'Richiesto per l\'accesso ai repository privati',
    pt: 'Necessário para acesso a repositórios privados',
    ja: 'プライベートリポジトリアクセスに必要',
    ko: '비공개 저장소 접근에 필요',
    zh: '访问私有仓库所需'
  },
  'settings.slackIntegration': {
    en: 'Enable Slack Notifications',
    es: 'Habilitar Notificaciones de Slack',
    fr: 'Activer les Notifications Slack',
    de: 'Slack-Benachrichtigungen Aktivieren',
    it: 'Abilita Notifiche Slack',
    pt: 'Ativar Notificações do Slack',
    ja: 'Slack通知を有効にする',
    ko: 'Slack 알림 활성화',
    zh: '启用Slack通知'
  },
  'settings.slackIntegrationDescription': {
    en: 'Send meeting summaries to Slack',
    es: 'Enviar resúmenes de reuniones a Slack',
    fr: 'Envoyer les résumés de réunions vers Slack',
    de: 'Meeting-Zusammenfassungen an Slack senden',
    it: 'Inviare riassunti delle riunioni a Slack',
    pt: 'Enviar resumos de reuniões para o Slack',
    ja: '会議要約をSlackに送信',
    ko: '회의 요약을 Slack으로 전송',
    zh: '将会议摘要发送到Slack'
  },
  'settings.slackWebhook': {
    en: 'Slack Webhook URL',
    es: 'URL del Webhook de Slack',
    fr: 'URL du Webhook Slack',
    de: 'Slack Webhook-URL',
    it: 'URL Webhook Slack',
    pt: 'URL do Webhook do Slack',
    ja: 'Slack Webhook URL',
    ko: 'Slack 웹훅 URL',
    zh: 'Slack Webhook URL'
  },

  // API Debugging
  'settings.apiDebugging': {
    en: '🔧 API Debugging & Testing',
    es: '🔧 Depuración y Pruebas de API',
    fr: '🔧 Débogage et Test d\'API',
    de: '🔧 API-Debugging & -Tests',
    it: '🔧 Debug e Test API',
    pt: '🔧 Depuração e Teste de API',
    ja: '🔧 APIデバッグ＆テスト',
    ko: '🔧 API 디버깅 및 테스트',
    zh: '🔧 API调试和测试'
  },
  'settings.apiDebuggingDescription': {
    en: 'Test VoiceLink API endpoints and complete workflows to diagnose issues.',
    es: 'Probar endpoints de la API de VoiceLink y flujos de trabajo completos para diagnosticar problemas.',
    fr: 'Tester les points de terminaison de l\'API VoiceLink et les flux de travail complets pour diagnostiquer les problèmes.',
    de: 'VoiceLink API-Endpunkte und komplette Workflows testen, um Probleme zu diagnostizieren.',
    it: 'Testare gli endpoint dell\'API VoiceLink e i flussi di lavoro completi per diagnosticare problemi.',
    pt: 'Testar endpoints da API VoiceLink e fluxos de trabalho completos para diagnosticar problemas.',
    ja: 'VoiceLink APIエンドポイントと完全なワークフローをテストして問題を診断。',
    ko: 'VoiceLink API 엔드포인트와 완전한 워크플로우를 테스트하여 문제를 진단합니다.',
    zh: '测试VoiceLink API端点和完整工作流程以诊断问题。'
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
