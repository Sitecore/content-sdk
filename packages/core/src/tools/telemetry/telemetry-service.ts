import debugModule from 'debug';
import debug, { enableDebug } from '../../debug';
import { TelemetryEventInitializer } from './base-event';
import {
  CSDK_TELEMETRY_FIRST_API_CALL_ENV,
  SDK_FIRST_API_CALL_EVENT_NAME,
} from './first-api-call-event';

export class TelemetryService {
  static TELEMETRY_POST_URL = 'http://localhost:3100/events';

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

    const event = eventInit();
    event.date = new Date();

    if (event.name === SDK_FIRST_API_CALL_EVENT_NAME) {
      const latch = process.env[CSDK_TELEMETRY_FIRST_API_CALL_ENV]?.trim();
      if (latch) {
        debug.telemetry(
          'skipped (sdk-first-api-call; %s is set)',
          CSDK_TELEMETRY_FIRST_API_CALL_ENV
        );
        return false;
      }
    }

    debug.telemetry('sending telemetry event %s', JSON.stringify(event, null, 2));
    // eslint-disable-next-line no-console -- local / dev telemetry sink (no fs; safe for any runtime)
    console.log('[telemetry]', JSON.stringify(event, null, 2));
    try {
      fetch(this.TELEMETRY_POST_URL, {
        method: 'POST',
        body: JSON.stringify(event),
      });
    } catch (error) {
      debug.telemetry('error sending telemetry events %s', error);
      return false;
    }
    if (event.name === SDK_FIRST_API_CALL_EVENT_NAME) {
      process.env[CSDK_TELEMETRY_FIRST_API_CALL_ENV] = '1';
    }
    return true;
  }
}

export default TelemetryService;
