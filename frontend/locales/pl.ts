export const pl = {
    // Nawigacja i Nagłówki
    dashboard: "Panel Sterowania Domem",
    devices: "Urządzenia",
    stats: "Statystyki",
    roomManagement: "Zarządzanie domem",
    history: "Historia Zdarzeń",

    // Pokoje
    rooms: "Pokoje",
    addRoom: "Dodaj Pokój",
    editRoom: "Edytuj Pokój",
    deleteRoom: "Usuń Pokój",
    addDevice: "Dodaj Urządzenie",
    addNewDevice: "Dodaj Nowe Urządzenie",
    createRoom: "Utwórz Pokój",
    noDevices: "Brak urządzeń",
    noDevicesInThisRoom: "Brak urządzeń w tym pokoju",

    lightBulb: "Żarówka",
    thermostat: "Termostat",

    // Filtry
    searchPlaceholder: "Szukaj...",
    namePlaceholder: "Nazwa",
    onlyActive: "Tylko włączone",
    sortBy: "Sortuj wg",
    sortAlpha: "Alfabetycznie",
    sortOldest: "Najstarsze",

    // Akcje i Statusy
    on: "WŁ",
    off: "WYŁ",
    loading: "Ładowanie...",
    sending: "Wysyłanie...",
    adding: "Dodawanie...",
    back: "Wróć",
    backToDashboard: "← Wróć do Dashboardu",
    allDevices: "Wszystkie Urządzenia",
    page: "Strona",
    nextPage: "Następna",
    previousPage: "Poprzednia",
    of: "z",
    cancel: "Anuluj",
    saveChanges: "Zapisz Zmiany",

    // Widgety
    wind: "Wiatr",
    logs: "Historia Zdarzeń",
    noLogs: "Brak logów...",

    //Form
    name: "Nazwa",
    roomName: "Nazwa Pokoju",
    roomSearchPlaceholder: "np. Salon",
    type: "Typ",
    state: "Stan",
    actions: "Akcje",
    connectedRoom: "Powiązany Pokój",
    noConnectedRoom: "Brak Powiązanego Pokoju",
    minTwoCharacters: "Nazwa musi miec minimum dwa znaki",
    maxTwentyCharacters: "Nazwa może mieć maksimum 20 znaków",
    nameRequired: "Nazwa jest wymagana",
    roomNameRequired: "Nazwa pokoju jest wymagana",
    typeRequired: "Typ jest wymagany",
    sureWantToDeleteRoomMessage: "Czy na pewno chcesz usunąć ten pokój i wszystkie jego urządzenia?",
    roomNotFound: "Nie znaleziono pokoju!",

    newName: "Nowa Nazwa: ",
    deviceDeleteQuestion: "Czy na pewno chcesz usunąć to urządzenie?",

    // Statystyki
    statsTitle: "Statystyki Domu",
    chartRooms: "Urządzenia w pokojach",
    devicesAmountChartLegend: "Liczba urządzeń",
    devicesInRoom: "Urządzenia w pokoju",
    chartStatus: "Status urządzeń",
    summaryTitle: "Podsumowanie",
    // Funkcja dla dynamicznego tekstu
    summaryText: (count: number, rooms: number) =>
        `W twoim domu znajduje się łącznie ${count} urządzeń rozmieszczonych w ${rooms} pomieszczeniach.`,

    logout: "Wyloguj Się",
    clearLogs: "Wyczyść",
};