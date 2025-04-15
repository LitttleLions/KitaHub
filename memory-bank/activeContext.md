# Aktueller Stand der Entwicklung

## Problemstellung
Derzeit besteht das Problem, dass die Module im Projekt nicht korrekt geladen werden, insbesondere `module-alias`. Die Docker-Umgebung verursacht Schwierigkeiten bei der Modulauflösung, was zu Fehlern beim Start führt.

## Lösungsschritte
- Entfernen der Docker-abhängigen Konfigurationen, um die Module lokal direkt zu starten.
- Anpassung der Import-Pfade im Code, insbesondere die Zeile `import 'module-alias/register.js';` wurde entfernt.
- Dokumentation der Änderungen in der Memory Bank, um die Rückkehr zu Docker später zu erleichtern.

## Umsetzung
- Die Zeile `import 'module-alias/register.js';` wurde aus `server/src/server.ts` entfernt.
- Die Projektstruktur wurde so angepasst, dass die Module direkt im lokalen Umfeld geladen werden.
- Die Build- und Start-Skripte wurden entsprechend angepasst, um ohne Docker zu laufen.

## Nächste Schritte
- Testen des lokalen Starts (`npm run build` und `node dist/server.js`).
- Überprüfung, ob die Module jetzt korrekt geladen werden.
- Dokumentation der Rückkehr zu Docker, um den Service später auf dem Server zu deployen.

## Wichtige Erkenntnis: TypeScript Pfad-Aliase vs. Node.js Runtime
- **Problem:** Nach der Umstellung auf lokale Ausführung ohne Docker traten `ERR_MODULE_NOT_FOUND`-Fehler auf. Der Grund ist, dass TypeScript-Pfad-Aliase (z.B. `@services/...`), die in `tsconfig.json` definiert sind, nur vom TypeScript-Compiler verstanden werden. Die kompilierte JavaScript-Ausgabe enthält diese Aliase weiterhin, aber die Node.js-Runtime kann sie nicht auflösen, da sie keine echten npm-Paketnamen oder relativen/absoluten Pfade sind.
- **Lösung:** Alle Importe, die Pfad-Aliase verwenden, müssen im Quellcode durch **relative Pfade** ersetzt werden (z.B. `import { ImportStatusService } from '../services/importStatusService.js';`). Nur so kann Node.js die Module zur Laufzeit korrekt finden.
- **Konsequenz:** Bei lokaler Ausführung ohne Docker (oder ein anderes Tool wie `module-alias`, das die Aliase zur Laufzeit auflöst) müssen relative Pfade verwendet werden. Dies wurde im Code umgesetzt.

## Fazit
Derzeit läuft der Server lokal ohne Docker, was die Fehlersuche erleichtert. Die Pfad-Alias-Problematik wurde durch Umstellung auf relative Pfade gelöst. Die Rückkehr zu Docker ist vorbereitet und kann bei Bedarf wieder aktiviert werden (dann könnten Pfad-Aliase ggf. wieder funktionieren, wenn die Docker-Umgebung dies unterstützt, z.B. durch `module-alias`).

## Docker-Entfernung und Rückkehrhinweis
- Docker und docker-compose wurden aus dem Entwicklungsprozess entfernt, um lokale Entwicklung und Debugging zu vereinfachen.
- Die Docker-Konfigurationsdateien (`Dockerfile`, `docker-compose.yml`) bleiben im Projekt erhalten, um eine spätere Reaktivierung zu ermöglichen.
- Um wieder auf Docker umzusteigen, müssen die Docker-Container neu gebaut und gestartet werden mit `docker-compose up --build`.
- Die Ports und Netzwerkeinstellungen in Docker müssen beachtet werden, wie in den System Patterns dokumentiert.
- Diese Information ist hier dokumentiert, um den Wechsel zwischen lokalen und containerisierten Umgebungen transparent zu halten.
