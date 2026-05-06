export type Status = 'running' | 'finished';

export type Lottery = {
  id: string;
  type: 'simple';
  name: string;
  prize: string;
  status: Status;
}