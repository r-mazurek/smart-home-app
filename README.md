# Smart Home App

**Autor:** Rafał Mazurek,
**Grupa:** 4

Projekt końcowy na przedmioty:
* Protokoły Sieci Web
* Frontend Development
* Testowanie Automatyczne

---

## Opis Projektu
System do zarządzania inteligentnym domem napisany w Java 21 i Spring Boot. Aplikacja umożliwia zarządzanie pokojami i urządzeniami (oświetlenie, termostaty). Zawiera logikę automatyzacji ("Smart Home Brain") reagującą na warunki pogodowe i czasowe. Posiada przejrzysty i intuicyjny frontend napisany w Next.js.

Projekt realizuje pełne pokrycie testami automatycznymi (jednostkowe, API, perfomance i cucumber). Test coverage wynosi >80%.

---

## Instrukcja Uruchomienia Testów

Projekt wykorzystuje narzędzie Maven. Aby uruchomić testy, użyj poniższych komend w terminalu:

### 1. Kompletny test
Uruchamia testy jednostkowe, API, BDD, Performance (1000 zapytań GET, limit czasu 15s) oraz weryfikuje pokrycie kodu (JaCoCo > 80%).
```java
mvn clean verify
```
### 2. Testy API
```java
mvn -Dtest=SmartHomeApiTest test
```
### 3. BDD (Cucumber/Gherkin)
```java
mvn -Dtest=RunCucumberTest test
```
### 4. Performance Test
```java
mvn -Dtest=SmartHomePerformanceTest test
```

---

## Pipeline CI/CD

Projekt posiada skonfigurowany pipeline Github Actions
(`.github/workflows/ci.yml`).

### Trigger
Pipeline uruchamia się automatycznie przy:
- każdym **push** do gałęzi `main`
- każdym **pull_request** do gałęzi `main`

### Weryfikacja

Pipeline wykonuje następujące kroki:

1. **Kompilacja kodu**

2. **Uruchomienie testów**

3. **Sprawdzenie pokrycia kodu**


### Raporty

Po zakończeniu pipeline:
- **wyniki testów**
- **raport pokrycia kodu**

są publikowane jako artefakty w GitHub Actions i dostępne do pobrania.

---
