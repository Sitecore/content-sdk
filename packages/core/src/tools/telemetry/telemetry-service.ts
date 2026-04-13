import fs from 'fs';
import path from 'path';
import debugModule from 'debug';
import debug, { enableDebug } from '../../debug';
import { TelemetryEventInitializer } from './base-event';
export class TelemetryService {
  static TELEMETRY_POST_URL = 'http://localhost:3100/events';
  // /sitecore-jss/telemetry-log.txt
  static LOG_FILE_PATH = path.resolve(__dirname, '../../../telemetry-log.txt');

  static disable() {
    process.env.JSS_TELEMETRY = 'false';
  }

  static enable() {
    process.env.JSS_TELEMETRY = 'true';
  }

  static isEnabled() {
    return process.env.JSS_TELEMETRY !== 'false';
  }

  static dispatch(eventInit: TelemetryEventInitializer) {
    if (process.env.DEBUG && !debugModule.enabled(debug.telemetry.namespace)) {
      enableDebug(process.env.DEBUG);
    }

    if (!this.isEnabled()) {
      debug.telemetry('skipped (telemetry is disabled)');
      return false;
    }

    let data = [];

    if (fs.existsSync(this.LOG_FILE_PATH)) {
      data = JSON.parse(fs.readFileSync(this.LOG_FILE_PATH, { encoding: 'utf-8' }));
    }

    const event = eventInit();
    event.date = new Date();

    debug.telemetry('sending telemetry event %s', JSON.stringify(event, null, 2));

    const chunk = JSON.stringify([...data, event], null, 2);

    fs.writeFileSync(this.LOG_FILE_PATH, chunk);
    try {
      fetch(this.TELEMETRY_POST_URL, {
        method: 'POST',
        body: JSON.stringify(event),
      });
    } catch (error) {
      debug.telemetry('error sending telemetry events %s', error);
      return false;
    }
    return true;
  }
}

export default TelemetryService;
