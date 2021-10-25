import { useEffect, useCallback, useState, DragEvent } from 'react';
import './App.css';

import BlueCandy from './images/blue-candy.jpg';
import YellowCandy from './images/yellow-candy.jpg';
import OrangeCandy from './images/orange-candy.jpg';
import PurpleCandy from './images/purple-candy.jpg';
import RedCandy from './images/red-candy.jpg';
import GreenCandy from './images/green-candy.jpg';
import Blank from './images/blank.png';

const Width: number = 8;

const Colors: string[] = [
  BlueCandy,
  YellowCandy,
  OrangeCandy,
  PurpleCandy,
  RedCandy,
  GreenCandy,
];

const firstRow: number[] = Array.from(Array(Width).keys());

const getRandomColor = () => Colors[Math.floor(Math.random() * Colors.length)];

const notValidRowThree = () => {
  const invalid = [];

  for (let i = 0; i < Width; i++) {
    const index = i + 1;
    invalid.push(...[index * Width - 2, index * Width - 1]);
  }
  return invalid;
}

const notValidRowFour = () => {
  const invalid = [];

  for (let i = 0; i < Width; i++) {
    const index = i + 1;
    invalid.push(...[index * Width - 3, index * Width - 2, index * Width - 1]);
  }
  return invalid;
}

const App = () => {
  const [currentColorArrangement = [], setCurrentColorArrangement] = useState<string[]>([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState<HTMLImageElement>();
  const [squareBeingReplaced, setSquareBeingReplaced] = useState<HTMLImageElement>();

  const checkColumnsThree = useCallback(() => {
    for (let i = 0; i <= Width * Width - (Width * 2 + 1); i++) {
      const columnOfThree: number[] = [i, i + Width, i + Width * 2];
      const decidedColor = currentColorArrangement[i];

      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
        columnOfThree.forEach(square => currentColorArrangement[square] = Blank);
        return true;
      }
    }
  }, [currentColorArrangement])
  
  const checkRowThree = useCallback(() => {
    for (let i = 0; i <= Width * Width - 3; i++) {
      const rowOfThree: number[] = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = notValidRowThree();

      if (notValid.includes(i)) continue;

      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
        rowOfThree.forEach(square => currentColorArrangement[square] = Blank);
        return true;
      }
    }
  }, [currentColorArrangement])
  
  const checkColumnsFour = useCallback(() => {
    for (let i = 0; i <= Width * Width - (Width * 3 + 1); i++) {
      const columnOfFour: number[] = [i, i + Width, i + Width * 2];
      const decidedColor = currentColorArrangement[i];

      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor)) {
        columnOfFour.forEach(square => currentColorArrangement[square] = Blank);
        return true;
      }
    }
  }, [currentColorArrangement])

  const checkRowFour = useCallback(() => {
    for (let i = 0; i <= Width * Width - 4; i++) {
      const rowOfFour: number[] = [i, i + 1, i + 2, i + 4];
      const decidedColor = currentColorArrangement[i];
      const notValid = notValidRowFour();

      if (notValid.includes(i)) continue;

      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor)) {
        rowOfFour.forEach(square => currentColorArrangement[square] = Blank);
        return true;
      }
    }
  }, [currentColorArrangement])

  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i < Width * Width - Width; i++) {
      
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentColorArrangement[i] === Blank) {
        currentColorArrangement[i] = getRandomColor();
      }
      if ((currentColorArrangement[i + Width] === Blank)) {
        currentColorArrangement[i + Width] = currentColorArrangement[i];
        currentColorArrangement[i] = Blank;

      }
    }
  }, [currentColorArrangement]);
  
  const dragStart = (e: DragEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.log('dragStart', target.getAttribute('data-id'));
    setSquareBeingDragged(target);
  }
  const dragDrop = (e: DragEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.log('dragDrop', target.getAttribute('data-id'));
    setSquareBeingReplaced(target);
  }
  const dragEnd = (e: DragEvent<HTMLImageElement>) => {
    const isValid = (squareBeingDragged as HTMLImageElement) && (squareBeingReplaced as HTMLImageElement)
    if (!isValid) {
      return;
    }
    if (!(squareBeingDragged && squareBeingReplaced)) {
      return;
    }
    const squareBeingDraggedId: number = Number((squareBeingDragged as HTMLImageElement).getAttribute('data-id'));
    const squareBeingReplacedId: number = Number((squareBeingReplaced as HTMLImageElement).getAttribute('data-id'));
    const draggedSrc = squareBeingDragged?.getAttribute('src');
    const replacedSrc = squareBeingReplaced?.getAttribute('src');
    if (!(draggedSrc && replacedSrc)) {
      return;
    }
    
    currentColorArrangement[squareBeingReplacedId] = draggedSrc;
    currentColorArrangement[squareBeingDraggedId] = replacedSrc;
    
    console.log('squareBeingDraggedId', squareBeingDraggedId);
    console.log('squareBeingReplacedId', squareBeingReplacedId);

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - Width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + Width,
    ];

    const validMove = validMoves.includes(squareBeingReplacedId);
    
    const isColumnsThree = checkColumnsThree();
    const isRowThree = checkRowThree();
    const isColumnsFour = checkColumnsFour();
    const isRowFour = checkRowFour();
    
    const isWinner = (isColumnsThree || isRowThree || isColumnsFour || isRowFour);
    
    if (validMove && isWinner) {
      setSquareBeingDragged(undefined);
      setSquareBeingReplaced(undefined);
    }
    else {
      currentColorArrangement[squareBeingReplacedId] = replacedSrc;
      currentColorArrangement[squareBeingDraggedId] = draggedSrc;
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  }
  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < Width * Width; i++) {
      const randomColor = getRandomColor();

      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);
  
  useEffect(() => {
    const timer = setInterval(() => {
      checkColumnsThree();
      checkColumnsFour();
      checkRowThree();
      checkRowFour();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);
    return (() => clearInterval(timer));
  }, [checkColumnsThree, checkColumnsFour, checkRowThree, checkRowFour, moveIntoSquareBelow, currentColorArrangement]);

  return (
    <div className="app">
      <div className="game">
        {
          currentColorArrangement.map((color: string, index: number) => (
            <img
              key={index}
              alt={color}
              data-id={index}
              src={color}
              draggable={true}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDragStart={dragStart}
              onDrop={dragDrop}
              onDragEnd={dragEnd}
            />
          ))
        }
      </div>
    </div>
  );
}

export default App;
