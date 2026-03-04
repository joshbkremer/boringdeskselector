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
          { id: 'HS1',     label: 'HS1', reservable: true,  row: 0, col: 1 },
          { id: 'HS2',     label: 'HS2', reservable: true,  row: 1, col: 0 },
          { id: 'HS3',     label: 'HS3', reservable: true,  row: 1, col: 1 },
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
          { id: 'HS-R-01', label: 'X',   reservable: false, row: 0, col: 1 },
          { id: 'HS4',     label: 'HS4', reservable: true,  row: 1, col: 0 },
          { id: 'HS5',     label: 'HS5', reservable: true,  row: 1, col: 1 },
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
        rows: 2,
        cols: 2,
        desks: [
          { id: 'LS1', label: 'LS1', reservable: true, row: 0, col: 0 },
          { id: 'LS2', label: 'LS2', reservable: true, row: 0, col: 1 },
          { id: 'LS3', label: 'LS3', reservable: true, row: 1, col: 0 },
          { id: 'LS4', label: 'LS4', reservable: true, row: 1, col: 1 },
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
          { id: 'S1', label: 'S1', reservable: true, row: 0, col: 0 },
          { id: 'S2', label: 'S2', reservable: true, row: 0, col: 1 },
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
