export type RealtimeConnectionState = 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED';

export type RealtimeEventType =
  | 'NEW_NOTIFICATION'
  | 'TEAM_REQUEST'
  | 'TEAM_INVITATION'
  | 'TEAM_MEMBER_UPDATE'
  | 'EVENT_UPDATE'
  | 'EVENT_RESULT'
  | 'MENTORSHIP_UPDATE'
  | 'RANKING_UPDATE'
  | 'REPORT_STATUS_UPDATE';

export interface RealtimeEventPayload {
  type: RealtimeEventType;
  id: string;
  data: any;
  timestamp: string;
}

type EventCallback = (payload: RealtimeEventPayload) => void;

class RealtimeServiceManager {
  private socket: WebSocket | null = null;
  private state: RealtimeConnectionState = 'DISCONNECTED';
  private subscribers: Map<RealtimeEventType, Set<EventCallback>> = new Map();
  private stateSubscribers: Set<(state: RealtimeConnectionState) => void> = new Set();

  public connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    // Set connection state
    this.updateState('CONNECTED');
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.updateState('DISCONNECTED');
  }

  public subscribe(eventType: RealtimeEventType, callback: EventCallback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)?.add(callback);
  }

  public unsubscribe(eventType: RealtimeEventType, callback: EventCallback) {
    this.subscribers.get(eventType)?.delete(callback);
  }

  public onStateChange(callback: (state: RealtimeConnectionState) => void) {
    this.stateSubscribers.add(callback);
    callback(this.state);
    return () => this.stateSubscribers.delete(callback);
  }

  public getState(): RealtimeConnectionState {
    return this.state;
  }

  private updateState(newState: RealtimeConnectionState) {
    this.state = newState;
    this.stateSubscribers.forEach((cb) => cb(newState));
  }
}

export const realtimeService = new RealtimeServiceManager();
