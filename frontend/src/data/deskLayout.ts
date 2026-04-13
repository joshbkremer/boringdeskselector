import { AreaConfig } from '../types'

export const DESK_LAYOUT: AreaConfig[] = [
  {
    id: 'onsite-hs',
    name: 'Onsite HS',
    pods: [
      {
        id: 'hs-left',
        rows: 3,
        cols: 2,
        desks: [
          { id: 'HS-L-00', label: 'X',   reservable: false, row: 0, col: 0 },
          { id: 'HS1',     label: 'AA-HS1', reservable: true,  row: 0, col: 1 },
          { id: 'HS2',     label: 'BS-HS2', reservable: true,  row: 1, col: 0 },
          { id: 'HS3',     label: 'BBB-HS3', reservable: true,  row: 1, col: 1 },
          { id: 'HS-L-20', label: 'X',   reservable: false, row: 2, col: 0 },
          { id: 'HS-L-21', label: 'X',   reservable: false, row: 2, col: 1 },
        ],
      },
      {
        id: 'hs-right',
        rows: 3,
        cols: 2,
        desks: [
          { id: 'HS-R-00', label: 'X',   reservable: false, row: 0, col: 0 },
          { id: 'HS6',     label: 'HS6', reservable: true,  row: 0, col: 1 },
          { id: 'HS4',     label: 'JT-HS4', reservable: true,  row: 1, col: 0 },
          { id: 'HS5',     label: 'JK-HS5', reservable: true,  row: 1, col: 1 },
          { id: 'HS-R-20', label: 'X',   reservable: false, row: 2, col: 0 },
          { id: 'HS-R-21', label: 'X',   reservable: false, row: 2, col: 1 },
        ],
      },
    ],
  },
  {
    id: 'onsite-ls',
    name: 'Onsite LS',
    pods: [
      {
        id: 'ls-main',
        rows: 4,
        cols: 2,
        desks: [
          { id: 'LS1', label: 'LS1', reservable: true, row: 0, col: 0 },
          { id: 'LS2', label: 'LS2', reservable: true, row: 0, col: 1 },
          { id: 'LS3', label: 'LS3', reservable: true, row: 1, col: 0 },
          { id: 'LS4', label: 'LS4', reservable: true, row: 1, col: 1 },
          { id: 'LS5', label: 'LS5', reservable: true, row: 2, col: 0 },
          { id: 'LS6', label: 'LS6', reservable: true, row: 2, col: 1 },
          { id: 'LS7', label: 'LS7', reservable: true, row: 3, col: 0 },
          { id: 'LS8', label: 'LS8', reservable: true, row: 3, col: 1 },
        ],
      },
    ],
  },
  {
    id: 'synergist',
    name: 'Synergist',
    pods: [
      {
        id: 'syn-main',
        rows: 4,
        cols: 2,
        desks: [
          { id: 'S1', label: 'Dock-S1', reservable: true, row: 0, col: 0 },
          { id: 'S2', label: 'Dock-S2', reservable: true, row: 0, col: 1 },
          { id: 'S3', label: 'S3', reservable: true, row: 1, col: 0 },
          { id: 'S4', label: 'S4', reservable: true, row: 1, col: 1 },
          { id: 'S5', label: 'S5', reservable: true, row: 2, col: 0 },
          { id: 'S6', label: 'S6', reservable: true, row: 2, col: 1 },
          { id: 'S7', label: 'S7', reservable: true, row: 3, col: 0 },
          { id: 'S8', label: 'S8', reservable: true, row: 3, col: 1 },
        ],
      },
    ],
  },
]
