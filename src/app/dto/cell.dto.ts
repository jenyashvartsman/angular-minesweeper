export interface CellDto {
  reveled: boolean;
  marked: 'flag' | 'question' | null;
  isMine: boolean;
  isMineClicked: boolean;
  isMineHidden: boolean;
  minesProximity: number;
}
