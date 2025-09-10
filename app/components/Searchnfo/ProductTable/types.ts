export interface ISearchProps {
  allBoxes?: any[];
  boxPageChange?: (page: number) => void;
}

export interface ProductTableContentProps {
  boxResponce: any[];
  allBoxes: any[];
  selectedBoxNumber: null | number;
}

export interface PalletTableContentProps {
  allPallets: any[];
  fetchData: any;
}

export interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  handlePageChange: (pageNumber: number) => void;
}

export interface BoxTableContentProps {
  // currentBoxNumber?: number
  fetchData: any;
  currentBoxPage: number;
  searchResultBoxNumber?: number;
}

export enum MessageType {
  Delete = "delete",
  MoveBox = "move-box",
  Pause = 'pause'
}
