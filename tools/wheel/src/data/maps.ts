import type { MapEntity } from '../types/MapEntity.type';

export type StageDef = {
  title: string;
  entities?: MapEntity[];
  goalY: number;
  zoomY: number;
  /** 순위 계산 보조 정보 (물리에는 영향 없음) */
  progress?: ProgressHints;
  /** 연출 구역. 있으면 zoomY 대신 이 구역들로 줌인과 슬로모션을 건다 */
  zoomZones?: ZoomZone[];
  /** 카메라 구역. 카메라가 주목하는 구슬이 구역 안에 있으면 구슬 대신 구역 전체를 화면에 담는다 (결승 줌인 중에는 쓰지 않는다) */
  cameraZones?: CameraZone[];
  /** 결승선을 그릴 통로의 좌우 x (goalY 높이). 그림에만 쓰고 물리·판정은 읽지 않는다 */
  finish?: { x1: number; x2: number };
};

/** 연출 구역 (x, y 는 가운데, w, h 는 전체 크기). 가운데로 갈수록 연출이 세진다 */
export type ZoomZone = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/** 카메라 구역 (x, y 는 가운데, w, h 는 전체 크기) */
export type CameraZone = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/** 일방통행 선: 시작점 → 끝점 방향의 오른쪽으로만 통과할 수 있다고 보고 순위를 계산한다 */
export type OneWayLine = {
  from: [number, number];
  to: [number, number];
};

export type ProgressHints = {
  oneWays?: OneWayLine[];
};

/** 원본에는 맵이 여럿 있지만 이 판에는 '운명의 수레바퀴'(Wheel of fortune) 하나만 남겼다 */
export const stages: StageDef[] = [
  {
    title: 'Wheel of fortune',
    goalY: 111,
    zoomY: 106.75,
    finish: { x1: 15.1, x2: 16 },
    entities: [
      // polyline
      {
        position: { x: 0, y: 0 },
        shape: {
          type: 'polyline',
          points: [
            [16.5, -300],
            [9.25, -300],
            [9.25, 8.5],
            [2, 19.25],
            [2, 26],
            [9.75, 30],
            [9.75, 33.5],
            [1.25, 41],
            [1.25, 53.75],
            [8.25, 58.75],
            [8.25, 63],
            [9.25, 64],
            [8.25, 65],
            [8.25, 99.25],
            [15.1, 106.75],
            [15.1, 111.75],
          ],
          rotation: 0,
        },
        type: 'static',
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        type: 'static',
        position: { x: 0, y: 0 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
        shape: {
          type: 'polyline',
          rotation: 0,
          points: [
            [16.5, -300],
            [16.5, 9.25],
            [9.5, 20],
            [9.5, 22.5],
            [17.5, 26],
            [17.5, 33.5],
            [24, 38.5],
            [19, 45.5],
            [19, 55.5],
            [24, 59.25],
            [24, 63],
            [23, 64],
            [24, 65],
            [24, 100.5],
            [16, 106.75],
            [16, 111.75],
          ],
        },
      },
      {
        type: 'static',
        position: { x: 0, y: 0 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
        shape: {
          type: 'polyline',
          rotation: 0,
          points: [
            [12.75, 37.5],
            [7, 43.5],
            [7, 49.75],
            [12.75, 53.75],
            [12.75, 37.5],
          ],
        },
      },
      {
        type: 'static',
        position: { x: 0, y: 0 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
        shape: {
          type: 'polyline',
          rotation: 0,
          points: [
            [14.75, 37.5],
            [14.75, 43],
            [17.5, 40.25],
            [14.75, 37.5],
          ],
        },
      },
      // boxes
      {
        position: { x: 15.5, y: 30.0 },
        shape: { type: 'box', width: 0.2, height: 0.2, rotation: -45 },
        type: 'static',
        props: { density: 1, angularVelocity: 0, restitution: 1 },
      },
      {
        position: { x: 15.5, y: 32 },
        type: 'static',
        shape: { type: 'box', width: 0.2, height: 0.2, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 15.5, y: 28 },
        type: 'static',
        shape: { type: 'box', width: 0.2, height: 0.2, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 12.5, y: 30 },
        type: 'static',
        shape: { type: 'box', width: 0.2, height: 0.2, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 12.5, y: 32 },
        type: 'static',
        shape: { type: 'box', width: 0.2, height: 0.2, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 12.5, y: 28 },
        type: 'static',
        shape: { type: 'box', width: 0.2, height: 0.2, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 9.4, y: 66.6 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: 45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 11.3, y: 66.6 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: 45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 13.2, y: 66.6 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: 45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 15.1, y: 66.6 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: 45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 17, y: 66.6 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: 45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 18.9, y: 66.6 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: 45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 20.699999999999996, y: 66.6 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: 45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 22.7, y: 66.6 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: 45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 9.4, y: 69.1 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 11.3, y: 69.1 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 13.2, y: 69.1 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 15.1, y: 69.1 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 17, y: 69.1 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 18.9, y: 69.1 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 20.699999999999996, y: 69.1 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 22.7, y: 69.1 },
        type: 'static',
        shape: { type: 'box', width: 0.6, height: 0.1, rotation: -45 },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 9.5, y: 92 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 12.75, y: 92 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 16, y: 92 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 19.25, y: 92 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 22.5, y: 92 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 11, y: 95 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 14.25, y: 95 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 17.5, y: 95 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 20.75, y: 95 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 9.5, y: 98 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 12.75, y: 98 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 16, y: 98 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 19.25, y: 98 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },
      {
        position: { x: 22.5, y: 98 },
        type: 'static',
        shape: {
          type: 'box',
          width: 0.25,
          height: 0.25,
          rotation: 0.7853981633974483,
        },
        props: { density: 1, angularVelocity: 0, restitution: 0 },
      },

      // wheels
      {
        position: { x: 8, y: 75 },
        type: 'kinematic',
        shape: { type: 'box', width: 2, height: 0.1, rotation: 0 },
        props: { density: 1, angularVelocity: 3.5, restitution: 0 },
      },
      {
        position: { x: 12, y: 75 },
        type: 'kinematic',
        shape: { type: 'box', width: 2, height: 0.1, rotation: 0 },
        props: { density: 1, angularVelocity: -3.5, restitution: 0 },
      },
      {
        position: { x: 16, y: 75 },
        type: 'kinematic',
        shape: { type: 'box', width: 2, height: 0.1, rotation: 0 },
        props: { density: 1, angularVelocity: 3.5, restitution: 0 },
      },
      {
        position: { x: 20, y: 75 },
        type: 'kinematic',
        shape: { type: 'box', width: 2, height: 0.1, rotation: 0 },
        props: { density: 1, angularVelocity: -3.5, restitution: 0 },
      },
      {
        position: { x: 24, y: 75 },
        type: 'kinematic',
        shape: { type: 'box', width: 2, height: 0.1, rotation: 0 },
        props: { density: 1, angularVelocity: 3.5, restitution: 0 },
      },
      {
        position: { x: 14, y: 106.75 },
        type: 'kinematic',
        shape: { type: 'box', width: 2, height: 0.1, rotation: 0 },
        props: { density: 1, angularVelocity: -1.2, restitution: 0 },
      },
    ],
  },
];
