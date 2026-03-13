const translations = {
  en: {
    code: 'en', label: 'English', flag: 'EN', tmdb: 'en-US',
    nav: { discover: 'Discover', moodMatch: 'Mood Match', searchPlaceholder: 'Search movies...', watchlist: 'Watchlist' },
    hero: { trendingNow: 'Trending Now', viewDetails: 'View Details', moodMatch: 'Mood Match' },
    home: { moodTeaser: 'AI-Powered', moodTitle: 'Mood Matcher', moodDesc: 'Tell us how you feel, and our AI will curate the perfect movie list for your mood.', trendingToday: 'Trending Today', trendingDesc: 'What the world is watching right now', browseGenre: 'Browse by Genre', trendingRegion: 'Trending by Region' },
    categories: { trending: 'Trending', popular: 'Popular', top_rated: 'Top Rated', now_playing: 'Now Playing', upcoming: 'Upcoming' },
    movie: { synopsis: 'Synopsis', communityRating: 'Community Rating', yourRating: 'Your Rating', noRatings: 'No ratings yet. Be the first!', cast: 'Cast', reviews: 'Reviews', writeReview: 'Write a Review', namePlaceholder: 'Your name (optional)', reviewPlaceholder: 'Share your thoughts about this movie...', postReview: 'Post Review', noReviews: 'No reviews yet. Be the first to share your thoughts!', recommendations: 'Recommendations', similarMovies: 'Similar Movies', similarDesc: 'Based on content analysis (TF-IDF)', peopleAlsoLiked: 'People Also Liked', collabDesc: 'Collaborative filtering - users with similar taste enjoyed these', moreGenre: 'More in This Genre', genreDesc: 'Discover similar movies by genre', noRecs: 'No recommendations available for this movie yet.', whereToWatch: 'Where to Watch', stream: 'Stream', rent: 'Rent', buy: 'Buy', free: 'Free', noProviders: 'No streaming info available for your region.', selectRegion: 'Select region', addWatchlist: 'Add to Watchlist', removeWatchlist: 'Remove from Watchlist', notFound: 'Movie Not Found', backHome: 'Back to home', rating: 'Rating' },
    mood: { title: 'Mood', titleHighlight: 'Matcher', subtitle: 'Describe your mood, vibe, or feeling — our AI will curate the perfect movies from worldwide cinema.', placeholder: 'I\'m feeling nostalgic, like watching something from the 90s with great music...', loading: 'Analyzing your mood and curating movies...', results: 'Movies for your mood', basedOn: 'Based on', error: 'AI recommendation failed. Please try again.', presets: ['Feel-good & uplifting', 'Dark & thrilling', 'Romantic & dreamy', 'Mind-bending & cerebral', 'Nostalgic & warm', 'Intense & emotional', 'Adventurous & epic', 'Cozy rainy day vibes'] },
    search: { title: 'Search Movies', resultsFor: 'Results for', placeholder: 'Search for any movie worldwide...', filterGenre: 'Filter by Genre', results: 'results found', noResults: 'No results found', noResultsDesc: 'Try different keywords or browse by genre above', searchDesc: 'Find any movie from worldwide cinema' },
    watchlist: { title: 'My Watchlist', empty: 'Your watchlist is empty', emptyDesc: 'Start adding movies you want to watch later!', browseMovies: 'Browse Movies', remove: 'Remove' },
    regions: { US: 'United States', IN: 'India', KR: 'South Korea', JP: 'Japan', FR: 'France', DE: 'Germany', ES: 'Spain', BR: 'Brazil', GB: 'United Kingdom', IT: 'Italy' },
  },
  hi: {
    code: 'hi', label: 'Hindi', flag: 'HI', tmdb: 'hi-IN',
    nav: { discover: 'खोजें', moodMatch: 'मूड मैच', searchPlaceholder: 'फिल्में खोजें...', watchlist: 'वॉचलिस्ट' },
    hero: { trendingNow: 'अभी ट्रेंडिंग', viewDetails: 'विवरण देखें', moodMatch: 'मूड मैच' },
    home: { moodTeaser: 'AI-संचालित', moodTitle: 'मूड मैचर', moodDesc: 'हमें बताएं कि आप कैसा महसूस कर रहे हैं, और हमारा AI आपके मूड के लिए सही फिल्में चुनेगा।', trendingToday: 'आज ट्रेंडिंग', trendingDesc: 'दुनिया क्या देख रही है', browseGenre: 'शैली द्वारा ब्राउज़ करें', trendingRegion: 'क्षेत्र के अनुसार ट्रेंडिंग' },
    categories: { trending: 'ट्रेंडिंग', popular: 'लोकप्रिय', top_rated: 'शीर्ष रेटेड', now_playing: 'अभी चल रहा है', upcoming: 'आगामी' },
    movie: { synopsis: 'सारांश', communityRating: 'सामुदायिक रेटिंग', yourRating: 'आपकी रेटिंग', noRatings: 'अभी तक कोई रेटिंग नहीं।', cast: 'कलाकार', reviews: 'समीक्षाएं', writeReview: 'समीक्षा लिखें', namePlaceholder: 'आपका नाम (वैकल्पिक)', reviewPlaceholder: 'इस फिल्म के बारे में अपने विचार साझा करें...', postReview: 'समीक्षा पोस्ट करें', noReviews: 'अभी तक कोई समीक्षा नहीं।', recommendations: 'सिफारिशें', similarMovies: 'समान फिल्में', similarDesc: 'सामग्री विश्लेषण पर आधारित', peopleAlsoLiked: 'लोगों ने भी पसंद किया', collabDesc: 'सहयोगी फिल्टरिंग', moreGenre: 'इस शैली में और', genreDesc: 'शैली के अनुसार समान फिल्में', noRecs: 'इस फिल्म के लिए कोई सिफारिशें उपलब्ध नहीं।', whereToWatch: 'कहां देखें', stream: 'स्ट्रीम', rent: 'किराये', buy: 'खरीदें', free: 'मुफ्त', noProviders: 'आपके क्षेत्र के लिए स्ट्रीमिंग जानकारी उपलब्ध नहीं।', selectRegion: 'क्षेत्र चुनें', addWatchlist: 'वॉचलिस्ट में जोड़ें', removeWatchlist: 'वॉचलिस्ट से हटाएं', notFound: 'फिल्म नहीं मिली', backHome: 'होम पर वापस', rating: 'रेटिंग' },
    mood: { title: 'मूड', titleHighlight: 'मैचर', subtitle: 'अपने मूड का वर्णन करें — हमारा AI दुनिया भर की सही फिल्में चुनेगा।', placeholder: 'मैं 90 के दशक की कुछ नॉस्टेल्जिक देखना चाहता हूं...', loading: 'आपका मूड विश्लेषण कर रहे हैं...', results: 'आपके मूड के लिए फिल्में', basedOn: 'आधारित:', error: 'AI सिफारिश विफल।', presets: ['खुशनुमा', 'डार्क और रोमांचक', 'रोमांटिक', 'दिमागी', 'पुरानी यादें', 'भावनात्मक', 'साहसिक', 'आरामदायक'] },
    search: { title: 'फिल्में खोजें', resultsFor: 'के लिए परिणाम', placeholder: 'कोई भी फिल्म खोजें...', filterGenre: 'शैली से फ़िल्टर करें', results: 'परिणाम मिले', noResults: 'कोई परिणाम नहीं', noResultsDesc: 'अलग कीवर्ड आज़माएं', searchDesc: 'दुनिया भर की कोई भी फिल्म खोजें' },
    watchlist: { title: 'मेरी वॉचलिस्ट', empty: 'आपकी वॉचलिस्ट खाली है', emptyDesc: 'बाद में देखने के लिए फिल्में जोड़ना शुरू करें!', browseMovies: 'फिल्में ब्राउज़ करें', remove: 'हटाएं' },
    regions: { US: 'संयुक्त राज्य', IN: 'भारत', KR: 'दक्षिण कोरिया', JP: 'जापान', FR: 'फ्रांस', DE: 'जर्मनी', ES: 'स्पेन', BR: 'ब्राज़ील', GB: 'यूनाइटेड किंगडम', IT: 'इटली' },
  },
  es: {
    code: 'es', label: 'Español', flag: 'ES', tmdb: 'es-ES',
    nav: { discover: 'Descubrir', moodMatch: 'Mood Match', searchPlaceholder: 'Buscar películas...', watchlist: 'Mi Lista' },
    hero: { trendingNow: 'Tendencia Ahora', viewDetails: 'Ver Detalles', moodMatch: 'Mood Match' },
    home: { moodTeaser: 'Con IA', moodTitle: 'Mood Matcher', moodDesc: 'Dinos cómo te sientes y nuestra IA seleccionará las películas perfectas para ti.', trendingToday: 'Tendencia Hoy', trendingDesc: 'Lo que el mundo está viendo', browseGenre: 'Explorar por Género', trendingRegion: 'Tendencia por Región' },
    categories: { trending: 'Tendencia', popular: 'Popular', top_rated: 'Mejor Valoradas', now_playing: 'En Cartelera', upcoming: 'Próximas' },
    movie: { synopsis: 'Sinopsis', communityRating: 'Valoración Comunidad', yourRating: 'Tu Valoración', noRatings: 'Sin valoraciones aún.', cast: 'Reparto', reviews: 'Reseñas', writeReview: 'Escribir Reseña', namePlaceholder: 'Tu nombre (opcional)', reviewPlaceholder: 'Comparte tu opinión sobre esta película...', postReview: 'Publicar Reseña', noReviews: 'Sin reseñas aún.', recommendations: 'Recomendaciones', similarMovies: 'Películas Similares', similarDesc: 'Basado en análisis de contenido', peopleAlsoLiked: 'También Gustaron', collabDesc: 'Filtrado colaborativo', moreGenre: 'Más del Género', genreDesc: 'Películas similares por género', noRecs: 'Sin recomendaciones disponibles.', whereToWatch: 'Dónde Ver', stream: 'Streaming', rent: 'Alquiler', buy: 'Comprar', free: 'Gratis', noProviders: 'Sin información de streaming para tu región.', selectRegion: 'Seleccionar región', addWatchlist: 'Añadir a Mi Lista', removeWatchlist: 'Quitar de Mi Lista', notFound: 'Película No Encontrada', backHome: 'Volver al inicio', rating: 'Valoración' },
    mood: { title: 'Mood', titleHighlight: 'Matcher', subtitle: 'Describe tu estado de ánimo — nuestra IA seleccionará las películas perfectas del cine mundial.', placeholder: 'Me siento nostálgico, quiero algo de los 90...', loading: 'Analizando tu estado de ánimo...', results: 'Películas para tu mood', basedOn: 'Basado en:', error: 'Recomendación IA falló.', presets: ['Alegre', 'Oscuro y emocionante', 'Romántico', 'Cerebral', 'Nostálgico', 'Intenso', 'Aventurero', 'Día lluvioso'] },
    search: { title: 'Buscar Películas', resultsFor: 'Resultados para', placeholder: 'Buscar cualquier película...', filterGenre: 'Filtrar por Género', results: 'resultados encontrados', noResults: 'Sin resultados', noResultsDesc: 'Prueba otras palabras clave', searchDesc: 'Encuentra cualquier película del cine mundial' },
    watchlist: { title: 'Mi Lista', empty: 'Tu lista está vacía', emptyDesc: 'Empieza a añadir películas para ver después!', browseMovies: 'Explorar Películas', remove: 'Quitar' },
    regions: { US: 'Estados Unidos', IN: 'India', KR: 'Corea del Sur', JP: 'Japón', FR: 'Francia', DE: 'Alemania', ES: 'España', BR: 'Brasil', GB: 'Reino Unido', IT: 'Italia' },
  },
  fr: {
    code: 'fr', label: 'Français', flag: 'FR', tmdb: 'fr-FR',
    nav: { discover: 'Découvrir', moodMatch: 'Mood Match', searchPlaceholder: 'Rechercher des films...', watchlist: 'Ma Liste' },
    hero: { trendingNow: 'Tendance', viewDetails: 'Voir Détails', moodMatch: 'Mood Match' },
    home: { moodTeaser: 'Propulsé par IA', moodTitle: 'Mood Matcher', moodDesc: 'Dites-nous comment vous vous sentez et notre IA sélectionnera les films parfaits.', trendingToday: 'Tendance Aujourd\'hui', trendingDesc: 'Ce que le monde regarde', browseGenre: 'Parcourir par Genre', trendingRegion: 'Tendance par Région' },
    categories: { trending: 'Tendance', popular: 'Populaire', top_rated: 'Mieux Notés', now_playing: 'À l\'Affiche', upcoming: 'À Venir' },
    movie: { synopsis: 'Synopsis', communityRating: 'Note Communauté', yourRating: 'Votre Note', noRatings: 'Aucune note encore.', cast: 'Distribution', reviews: 'Critiques', writeReview: 'Écrire une Critique', namePlaceholder: 'Votre nom (optionnel)', reviewPlaceholder: 'Partagez vos pensées...', postReview: 'Publier', noReviews: 'Aucune critique encore.', recommendations: 'Recommandations', similarMovies: 'Films Similaires', similarDesc: 'Basé sur l\'analyse de contenu', peopleAlsoLiked: 'Les Gens Ont Aussi Aimé', collabDesc: 'Filtrage collaboratif', moreGenre: 'Plus dans ce Genre', genreDesc: 'Films similaires par genre', noRecs: 'Aucune recommandation disponible.', whereToWatch: 'Où Regarder', stream: 'Streaming', rent: 'Location', buy: 'Acheter', free: 'Gratuit', noProviders: 'Aucune info streaming pour votre région.', selectRegion: 'Choisir région', addWatchlist: 'Ajouter à Ma Liste', removeWatchlist: 'Retirer de Ma Liste', notFound: 'Film Non Trouvé', backHome: 'Retour à l\'accueil', rating: 'Note' },
    mood: { title: 'Mood', titleHighlight: 'Matcher', subtitle: 'Décrivez votre humeur — notre IA sélectionnera les films parfaits du cinéma mondial.', placeholder: 'Je me sens nostalgique, je veux quelque chose des années 90...', loading: 'Analyse de votre humeur...', results: 'Films pour votre humeur', basedOn: 'Basé sur:', error: 'Recommandation IA échouée.', presets: ['Joyeux', 'Sombre et palpitant', 'Romantique', 'Cérébral', 'Nostalgique', 'Intense', 'Aventureux', 'Jour de pluie'] },
    search: { title: 'Rechercher des Films', resultsFor: 'Résultats pour', placeholder: 'Rechercher un film...', filterGenre: 'Filtrer par Genre', results: 'résultats trouvés', noResults: 'Aucun résultat', noResultsDesc: 'Essayez d\'autres mots-clés', searchDesc: 'Trouvez n\'importe quel film du cinéma mondial' },
    watchlist: { title: 'Ma Liste', empty: 'Votre liste est vide', emptyDesc: 'Ajoutez des films à regarder plus tard!', browseMovies: 'Parcourir les Films', remove: 'Retirer' },
    regions: { US: 'États-Unis', IN: 'Inde', KR: 'Corée du Sud', JP: 'Japon', FR: 'France', DE: 'Allemagne', ES: 'Espagne', BR: 'Brésil', GB: 'Royaume-Uni', IT: 'Italie' },
  },
  ko: {
    code: 'ko', label: '한국어', flag: 'KO', tmdb: 'ko-KR',
    nav: { discover: '탐색', moodMatch: '무드 매치', searchPlaceholder: '영화 검색...', watchlist: '관심목록' },
    hero: { trendingNow: '지금 인기', viewDetails: '상세보기', moodMatch: '무드 매치' },
    home: { moodTeaser: 'AI 추천', moodTitle: '무드 매처', moodDesc: '기분을 알려주시면 AI가 완벽한 영화를 추천해 드립니다.', trendingToday: '오늘의 인기', trendingDesc: '전 세계가 보고 있는 영화', browseGenre: '장르별 탐색', trendingRegion: '지역별 인기' },
    categories: { trending: '인기', popular: '대중적', top_rated: '최고 평점', now_playing: '상영중', upcoming: '개봉 예정' },
    movie: { synopsis: '줄거리', communityRating: '커뮤니티 평점', yourRating: '내 평점', noRatings: '아직 평점이 없습니다.', cast: '출연진', reviews: '리뷰', writeReview: '리뷰 작성', namePlaceholder: '이름 (선택)', reviewPlaceholder: '이 영화에 대한 생각을 공유하세요...', postReview: '리뷰 게시', noReviews: '아직 리뷰가 없습니다.', recommendations: '추천', similarMovies: '비슷한 영화', similarDesc: '콘텐츠 분석 기반', peopleAlsoLiked: '다른 사람들도 좋아한', collabDesc: '협업 필터링', moreGenre: '같은 장르', genreDesc: '장르별 비슷한 영화', noRecs: '추천 영화가 없습니다.', whereToWatch: '시청 가능한 곳', stream: '스트리밍', rent: '대여', buy: '구매', free: '무료', noProviders: '해당 지역의 스트리밍 정보가 없습니다.', selectRegion: '지역 선택', addWatchlist: '관심목록 추가', removeWatchlist: '관심목록 제거', notFound: '영화를 찾을 수 없음', backHome: '홈으로', rating: '평점' },
    mood: { title: '무드', titleHighlight: '매처', subtitle: '기분을 설명하면 AI가 전 세계 영화를 추천합니다.', placeholder: '90년대의 향수를 불러일으키는 영화가 보고 싶어요...', loading: '기분을 분석하고 영화를 선정 중...', results: '기분에 맞는 영화', basedOn: '기반:', error: 'AI 추천 실패.', presets: ['기분 좋은', '어둡고 스릴 넘치는', '로맨틱한', '지적인', '향수를 불러일으키는', '강렬한', '모험적인', '아늑한'] },
    search: { title: '영화 검색', resultsFor: '검색 결과', placeholder: '영화를 검색하세요...', filterGenre: '장르 필터', results: '개 결과', noResults: '결과 없음', noResultsDesc: '다른 키워드를 시도하세요', searchDesc: '전 세계 영화를 검색하세요' },
    watchlist: { title: '내 관심목록', empty: '관심목록이 비어 있습니다', emptyDesc: '나중에 볼 영화를 추가하세요!', browseMovies: '영화 탐색', remove: '제거' },
    regions: { US: '미국', IN: '인도', KR: '한국', JP: '일본', FR: '프랑스', DE: '독일', ES: '스페인', BR: '브라질', GB: '영국', IT: '이탈리아' },
  },
  ja: {
    code: 'ja', label: '日本語', flag: 'JA', tmdb: 'ja-JP',
    nav: { discover: '探索', moodMatch: 'ムードマッチ', searchPlaceholder: '映画を検索...', watchlist: 'ウォッチリスト' },
    hero: { trendingNow: 'トレンド', viewDetails: '詳細を見る', moodMatch: 'ムードマッチ' },
    home: { moodTeaser: 'AI搭載', moodTitle: 'ムードマッチャー', moodDesc: '気分を教えてください。AIが最適な映画を選びます。', trendingToday: '今日のトレンド', trendingDesc: '世界が見ている映画', browseGenre: 'ジャンルで探す', trendingRegion: '地域別トレンド' },
    categories: { trending: 'トレンド', popular: '人気', top_rated: '高評価', now_playing: '上映中', upcoming: '近日公開' },
    movie: { synopsis: 'あらすじ', communityRating: 'コミュニティ評価', yourRating: 'あなたの評価', noRatings: 'まだ評価がありません。', cast: 'キャスト', reviews: 'レビュー', writeReview: 'レビューを書く', namePlaceholder: '名前（任意）', reviewPlaceholder: 'この映画についての感想を共有...', postReview: '投稿', noReviews: 'レビューはまだありません。', recommendations: 'おすすめ', similarMovies: '似た映画', similarDesc: 'コンテンツ分析に基づく', peopleAlsoLiked: 'みんなが好きな', collabDesc: '協調フィルタリング', moreGenre: '同ジャンル', genreDesc: 'ジャンル別の似た映画', noRecs: 'おすすめ映画がありません。', whereToWatch: '視聴方法', stream: 'ストリーミング', rent: 'レンタル', buy: '購入', free: '無料', noProviders: 'この地域のストリーミング情報はありません。', selectRegion: '地域を選択', addWatchlist: 'リストに追加', removeWatchlist: 'リストから削除', notFound: '映画が見つかりません', backHome: 'ホームに戻る', rating: '評価' },
    mood: { title: 'ムード', titleHighlight: 'マッチャー', subtitle: '気分を説明すると、AIが世界中の映画からおすすめを選びます。', placeholder: '90年代のノスタルジックな映画が見たい...', loading: '気分を分析中...', results: '気分に合った映画', basedOn: '基づく:', error: 'AI推薦に失敗しました。', presets: ['幸せな', 'ダークでスリリング', 'ロマンチック', '知的', 'ノスタルジック', '激しい', '冒険的', '居心地のいい'] },
    search: { title: '映画を検索', resultsFor: '検索結果', placeholder: '映画を検索...', filterGenre: 'ジャンルフィルター', results: '件の結果', noResults: '結果なし', noResultsDesc: '別のキーワードを試してください', searchDesc: '世界中の映画を検索' },
    watchlist: { title: 'ウォッチリスト', empty: 'リストは空です', emptyDesc: '後で見る映画を追加しましょう！', browseMovies: '映画を探す', remove: '削除' },
    regions: { US: 'アメリカ', IN: 'インド', KR: '韓国', JP: '日本', FR: 'フランス', DE: 'ドイツ', ES: 'スペイン', BR: 'ブラジル', GB: 'イギリス', IT: 'イタリア' },
  },
  ar: {
    code: 'ar', label: 'العربية', flag: 'AR', tmdb: 'ar-SA',
    nav: { discover: 'اكتشف', moodMatch: 'مطابقة المزاج', searchPlaceholder: 'ابحث عن أفلام...', watchlist: 'قائمتي' },
    hero: { trendingNow: 'رائج الآن', viewDetails: 'عرض التفاصيل', moodMatch: 'مطابقة المزاج' },
    home: { moodTeaser: 'مدعوم بالذكاء الاصطناعي', moodTitle: 'مطابق المزاج', moodDesc: 'أخبرنا كيف تشعر وسيختار الذكاء الاصطناعي أفلامًا مثالية لمزاجك.', trendingToday: 'رائج اليوم', trendingDesc: 'ما يشاهده العالم الآن', browseGenre: 'تصفح حسب النوع', trendingRegion: 'رائج حسب المنطقة' },
    categories: { trending: 'رائج', popular: 'شائع', top_rated: 'الأعلى تقييمًا', now_playing: 'يعرض الآن', upcoming: 'قادم' },
    movie: { synopsis: 'ملخص', communityRating: 'تقييم المجتمع', yourRating: 'تقييمك', noRatings: 'لا توجد تقييمات بعد.', cast: 'طاقم التمثيل', reviews: 'المراجعات', writeReview: 'اكتب مراجعة', namePlaceholder: 'اسمك (اختياري)', reviewPlaceholder: 'شارك أفكارك حول هذا الفيلم...', postReview: 'نشر', noReviews: 'لا توجد مراجعات بعد.', recommendations: 'توصيات', similarMovies: 'أفلام مشابهة', similarDesc: 'بناءً على تحليل المحتوى', peopleAlsoLiked: 'أعجب الناس أيضًا', collabDesc: 'تصفية تعاونية', moreGenre: 'المزيد من هذا النوع', genreDesc: 'أفلام مشابهة حسب النوع', noRecs: 'لا توجد توصيات متاحة.', whereToWatch: 'أين تشاهد', stream: 'بث', rent: 'إيجار', buy: 'شراء', free: 'مجاني', noProviders: 'لا توجد معلومات بث لمنطقتك.', selectRegion: 'اختر المنطقة', addWatchlist: 'أضف للقائمة', removeWatchlist: 'أزل من القائمة', notFound: 'الفيلم غير موجود', backHome: 'العودة للرئيسية', rating: 'تقييم' },
    mood: { title: 'مطابق', titleHighlight: 'المزاج', subtitle: 'صف مزاجك وسيختار الذكاء الاصطناعي أفلامًا من السينما العالمية.', placeholder: 'أشعر بالحنين، أريد شيئًا من التسعينيات...', loading: 'جارٍ تحليل مزاجك...', results: 'أفلام لمزاجك', basedOn: 'بناءً على:', error: 'فشلت توصية الذكاء الاصطناعي.', presets: ['سعيد', 'مظلم ومثير', 'رومانسي', 'فكري', 'حنين', 'مكثف', 'مغامر', 'يوم ممطر'] },
    search: { title: 'بحث عن أفلام', resultsFor: 'نتائج لـ', placeholder: 'ابحث عن أي فيلم...', filterGenre: 'تصفية حسب النوع', results: 'نتائج', noResults: 'لا نتائج', noResultsDesc: 'جرب كلمات مفتاحية مختلفة', searchDesc: 'ابحث عن أي فيلم في العالم' },
    watchlist: { title: 'قائمتي', empty: 'قائمتك فارغة', emptyDesc: 'ابدأ بإضافة أفلام لمشاهدتها لاحقًا!', browseMovies: 'تصفح الأفلام', remove: 'إزالة' },
    regions: { US: 'الولايات المتحدة', IN: 'الهند', KR: 'كوريا الجنوبية', JP: 'اليابان', FR: 'فرنسا', DE: 'ألمانيا', ES: 'إسبانيا', BR: 'البرازيل', GB: 'المملكة المتحدة', IT: 'إيطاليا' },
  },
  de: {
    code: 'de', label: 'Deutsch', flag: 'DE', tmdb: 'de-DE',
    nav: { discover: 'Entdecken', moodMatch: 'Mood Match', searchPlaceholder: 'Filme suchen...', watchlist: 'Merkliste' },
    hero: { trendingNow: 'Aktuell beliebt', viewDetails: 'Details ansehen', moodMatch: 'Mood Match' },
    home: { moodTeaser: 'KI-Gestützt', moodTitle: 'Mood Matcher', moodDesc: 'Erzählen Sie uns Ihre Stimmung und unsere KI wählt die perfekten Filme.', trendingToday: 'Heute beliebt', trendingDesc: 'Was die Welt gerade schaut', browseGenre: 'Nach Genre durchsuchen', trendingRegion: 'Beliebt nach Region' },
    categories: { trending: 'Beliebt', popular: 'Populär', top_rated: 'Bestbewertet', now_playing: 'Im Kino', upcoming: 'Demnächst' },
    movie: { synopsis: 'Handlung', communityRating: 'Community-Bewertung', yourRating: 'Ihre Bewertung', noRatings: 'Noch keine Bewertungen.', cast: 'Besetzung', reviews: 'Kritiken', writeReview: 'Kritik schreiben', namePlaceholder: 'Ihr Name (optional)', reviewPlaceholder: 'Teilen Sie Ihre Gedanken...', postReview: 'Veröffentlichen', noReviews: 'Noch keine Kritiken.', recommendations: 'Empfehlungen', similarMovies: 'Ähnliche Filme', similarDesc: 'Basierend auf Inhaltsanalyse', peopleAlsoLiked: 'Andere mochten auch', collabDesc: 'Kollaboratives Filtern', moreGenre: 'Mehr aus diesem Genre', genreDesc: 'Ähnliche Filme nach Genre', noRecs: 'Keine Empfehlungen verfügbar.', whereToWatch: 'Wo ansehen', stream: 'Streamen', rent: 'Leihen', buy: 'Kaufen', free: 'Kostenlos', noProviders: 'Keine Streaming-Infos für Ihre Region.', selectRegion: 'Region wählen', addWatchlist: 'Zur Merkliste', removeWatchlist: 'Von Merkliste entfernen', notFound: 'Film nicht gefunden', backHome: 'Zurück zur Startseite', rating: 'Bewertung' },
    mood: { title: 'Mood', titleHighlight: 'Matcher', subtitle: 'Beschreiben Sie Ihre Stimmung — unsere KI wählt Filme aus dem Weltkino.', placeholder: 'Ich fühle mich nostalgisch, will etwas aus den 90ern...', loading: 'Stimmung wird analysiert...', results: 'Filme für Ihre Stimmung', basedOn: 'Basierend auf:', error: 'KI-Empfehlung fehlgeschlagen.', presets: ['Fröhlich', 'Dunkel & spannend', 'Romantisch', 'Intellektuell', 'Nostalgisch', 'Intensiv', 'Abenteuerlich', 'Gemütlich'] },
    search: { title: 'Filme suchen', resultsFor: 'Ergebnisse für', placeholder: 'Film suchen...', filterGenre: 'Nach Genre filtern', results: 'Ergebnisse', noResults: 'Keine Ergebnisse', noResultsDesc: 'Versuchen Sie andere Schlüsselwörter', searchDesc: 'Finden Sie jeden Film weltweit' },
    watchlist: { title: 'Meine Merkliste', empty: 'Ihre Merkliste ist leer', emptyDesc: 'Fügen Sie Filme zum späteren Ansehen hinzu!', browseMovies: 'Filme durchsuchen', remove: 'Entfernen' },
    regions: { US: 'Vereinigte Staaten', IN: 'Indien', KR: 'Südkorea', JP: 'Japan', FR: 'Frankreich', DE: 'Deutschland', ES: 'Spanien', BR: 'Brasilien', GB: 'Vereinigtes Königreich', IT: 'Italien' },
  },
};

export const SUPPORTED_LANGUAGES = Object.keys(translations);

export const getTranslation = (lang) => translations[lang] || translations.en;

export const useLanguage = () => {
  const savedLang = localStorage.getItem('cinemind_lang') || 'en';
  return getTranslation(savedLang);
};

export const getCurrentLang = () => localStorage.getItem('cinemind_lang') || 'en';

export const setLanguage = (lang) => {
  localStorage.setItem('cinemind_lang', lang);
  window.dispatchEvent(new Event('languageChange'));
};

export default translations;
