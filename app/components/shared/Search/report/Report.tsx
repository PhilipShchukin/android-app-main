// 'use client';
// import React, { KeyboardEvent, ChangeEvent, useState, useEffect, useRef, Fragment } from 'react';
// import styles from '../search.module.css';
// import BurgerMenu from '../../BurgerMenu/BurgerMenu';
// import useSearchDispatch from '@/app/hooks/useSearchDispatch';
// import { findBoxPage } from '../helper';
// import { useDispatch } from 'react-redux';
// import { searhChangeBoxNumberPage } from '@/app/store/DBWorkSlice';
// import { itemsPerPage } from '@/app/helpers/constants';
// import { parseCodeHelper, ParsedData } from '../parce.helper';
// import { FaTrash, FaPallet, FaBox, FaChevronUp, FaChevronDown } from 'react-icons/fa';
// import { notifyError, notifySuccess } from '@/app/API/apiClient';
// import Modal from '@/app/components/Modal/Modal';

// interface ContainerItem {
//   id: string;
//   type: 'box' | 'pallet';
//   label: string;
//   foundTables: string;
// }

// export interface ContainerData {
//   boxes: Array<{ box: string; table: string }>;
//   pallets: Array<{ pallet: string; table: string }>;
// }

// export default function Report() {
//   const [currentInput, setCurrentInput] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState<string>('');
//   const [containers, setContainers] = useState<ContainerItem[]>([]);
//   const abortControllerRef = useRef<AbortController | null>(null);

//   const [expandedItem, setExpandedItem] = useState<string | null>(null);
//   const [currentRes, setCurrentRes] = useState<any>('');

//   const { getCodeSearchGlobalBox, getCodeSearchGlobalPallet, getReportBoxAndPallet } =
//     useSearchDispatch();

//   useEffect(() => {
//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, []);

//   const processBarcode = (rawCode: string): string => {
//     const cleanCode = rawCode.replace(/^[\x00-\x1F]+/, '');
//     return cleanCode.slice(16);
//   };

//   const handleSearch = async (code: string) => {
//     if (!code || isLoading) return;

//     const isAlreadyAdded = containers.some((item) => item.id === code);
//     if (isAlreadyAdded) {
//       // setErrorMessage(`Код ${code} уже был добавлен ранее`);
//       notifyError(`Код ${code} уже был добавлен ранее`);

//       return; // Не продолжаем обработку
//     }

//     setIsLoading(true);
//     // setErrorMessage('');

//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }

//     const controller = new AbortController();
//     abortControllerRef.current = controller;

//     try {
//       const processedCode = processBarcode(code);

//       if (processedCode.startsWith('21')) {
//         notifyError('Ошибка: получен продукт, а не коробки/паллеты');

//         // setErrorMessage('Ошибка: получен продукт, а не коробки/паллеты');
//       } else {
//         const parsedData = parseCodeHelper(code);
//         console.log(parsedData, 'parsedData');

//         if (parsedData?.containerType === 'box') {
//           const response = await getCodeSearchGlobalBox(code);

//           if (response?.status === 200) {
//             addContainer(code, parsedData, response.foundTables || '');
//           } else {
//             notifyError(response?.message || 'Ошибка при поиске коробки');

//             // setErrorMessage(response?.message || 'Ошибка при поиске коробки');
//             return;
//           }
//         }
//         if (parsedData?.containerType === 'pallet') {
//           const response = await getCodeSearchGlobalPallet(code);

//           if (response?.status === 200) {
//             addContainer(code, parsedData, response.foundTables || '');
//           } else {
//             // setErrorMessage(response?.message || 'Ошибка при поиске паллеты');
//             notifyError(response?.message || 'Ошибка при поиске паллеты');

//             return;
//           }
//         }
//       }
//     } catch (error) {
//       if ((error as Error).name !== 'AbortError') {
//         console.error('Ошибка поиска:', error);
//         notifyError('Ошибка при обработке запроса');
//         // setErrorMessage('Ошибка при обработке запроса');
//       }
//     } finally {
//       if (abortControllerRef.current === controller) {
//         abortControllerRef.current = null;
//       }
//       setIsLoading(false);
//       setCurrentInput('');
//     }
//   };

//   const addContainer = (code: string, parsedData: any, foundTables: string) => {
//     const newContainer: ContainerItem = {
//       id: code,
//       type: parsedData.containerType,
//       label:
//         parsedData.containerType === 'box'
//           ? `Коробка ${parsedData.containerNumber}`
//           : `Паллета ${parsedData.containerNumber}`,
//       foundTables,
//     };

//     setContainers((prev) => [...prev, newContainer]);
//   };

//   const removeContainer = (id: string) => {
//     setContainers((prev) => prev.filter((item) => item.id !== id));
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleSearch(currentInput.trim());
//     }
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setCurrentInput(e.target.value);
//   };

//   const handlePrintReport = async () => {
//     const containerData = getContainerData();

//     const report = await getReportBoxAndPallet(containerData);

//     if (report) {
//       setMessage(report);
//       setContainers([]);
//       handleOpenModal();
//     } else {
//       console.log('failed');
//     }
//   };

//   // Разделяем контейнеры на паллеты и коробки
//   const pallets = containers.filter((item) => item.type === 'pallet');
//   const boxes = containers.filter((item) => item.type === 'box');

//   const getContainerData = (): ContainerData => {
//     const boxData = containers
//       .filter((item) => item.type === 'box')
//       .map((item) => ({
//         box: item.id,
//         table: item.foundTables,
//       }));

//     const palletData = containers
//       .filter((item) => item.type === 'pallet')
//       .map((item) => ({
//         pallet: item.id,
//         table: item.foundTables,
//       }));

//     return {
//       boxes: boxData,
//       pallets: palletData,
//     };
//   };

//   const moreInfo = (item: any) => {
//     const parsedData = parseCodeHelper(item.id);

//     setExpandedItem(expandedItem === item.id ? null : item.id);
//     setCurrentRes(parsedData);
//   };
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const inputRef = useRef<HTMLInputElement>(null);

//   // держим постоянный фокус на инпуте
//   useEffect(() => {
//     const keepFocus = () => {
//       if (inputRef.current && document.activeElement !== inputRef.current) {
//         inputRef.current.focus();
//       }
//     };

//     keepFocus();
//     const interval = setInterval(keepFocus, 500);
//     return () => clearInterval(interval);
//   }, []);

//   // const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
//   //   const val = (e.target as HTMLInputElement).value;

//   //   // Если сканер отправил Enter (обычно \n или \r)
//   //   if (val.endsWith('\n') || val.endsWith('\r')) {
//   //     handleSearch(val.trim());
//   //     setCurrentInput(''); // очищаем поле
//   //   } else {
//   //     setCurrentInput(val);
//   //   }
//   // };

//   return (
//     <div className={styles.search}>
//       <Modal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         styles={{ width: '400px', background: '#97F241', border: 'none', bottom: '23%' }}
//       >
//         В отчете {message} кода продукта.
//       </Modal>
//       <BurgerMenu />
//       <input
//         type="text"
//         value={currentInput}
//         onChange={handleChange}
//         onKeyDown={handleKeyDown}
//         placeholder="Введите штрихкод для отгрузки"
//         disabled={isLoading}
//         autoFocus
//       />

//       {/* <input
//         ref={inputRef}
//         type="text"
//         value={currentInput}
//         onInput={handleInput}
//         placeholder="Введите штрихкод для отгрузки"
//         disabled={isLoading}
//         autoFocus
//         inputMode="none"
//         readOnly
//         onFocus={(e) => {
//           e.currentTarget.removeAttribute('readonly');
//         }}
//         onBlur={(e) => {
//           e.currentTarget.setAttribute('readonly', 'true');
//         }}
//       /> */}

//       {isLoading && <div className={styles.loading}>Поиск...</div>}

//       {/* {errorMessage && (
//         <div className={styles.error}>
//           {errorMessage.split('\n').map((line, i) => (
//             <p key={i}>{line}</p>
//           ))}
//         </div>
//       )} */}

//       {pallets.length > 0 && (
//         <div className={styles.containerList}>
//           <h3>Паллеты</h3>
//           <ul>
//             {pallets.map((item) => (
//               <Fragment key={item.id}>
//                 <li className={styles.containerItem}>
//                   <div className={styles.itemMain}>
//                     <FaPallet className={styles.containerIcon} />

//                     <button
//                       onClick={() => moreInfo(item)}
//                       className={styles.toggleButton}
//                       title={expandedItem === item.id ? 'Скрыть' : 'Показать'}
//                     >
//                       {expandedItem === item.id ? <FaChevronUp /> : <FaChevronDown />}
//                     </button>

//                     <span>{item.label}</span>
//                     <div className={styles.buttons}>
//                       {/* <button
//                         onClick={() => moreInfo(item)}
//                         className={styles.toggleButton}
//                         title={expandedItem === item.id ? 'Скрыть' : 'Показать'}
//                       >
//                         {expandedItem === item.id ? <FaChevronUp /> : <FaChevronDown />}
//                       </button> */}
//                       <button
//                         onClick={() => removeContainer(item.id)}
//                         className={styles.deleteButton}
//                         title="Удалить"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   </div>
//                 </li>

//                 {/* Отдельный блок информации под li */}
//                 {expandedItem === item.id && (
//                   <div className={styles.detailsContainer}>
//                     <div className={styles.itemDetails}>
//                       <h4>Подробности паллеты</h4>
//                       <div className={styles.detailsGrid}>
//                         <div className={styles.detailItem}>
//                           <span className={styles.detailLabel}>GTIN:</span>
//                           <span> {currentRes.gtin}</span>
//                         </div>
//                         <div className={styles.detailItem}>
//                           <span className={styles.detailLabel}>Дата создания:</span>
//                           <span>{currentRes.productionDate}</span>
//                         </div>
//                         <div className={styles.detailItem}>
//                           <span className={styles.detailLabel}>Окончание годности:</span>
//                           <span>{currentRes.expiryDate}</span>
//                         </div>
//                         <div className={styles.detailItem}>
//                           <span className={styles.detailLabel}>Партия:</span>
//                           <span>{currentRes.batchNumber}</span>
//                         </div>
//                         <div className={styles.detailItem}>
//                           <span className={styles.detailLabel}>Количество:</span>
//                           <span>{currentRes.quantity}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </Fragment>
//             ))}
//           </ul>
//         </div>
//       )}

//       {boxes.length > 0 && (
//         <div className={styles.containerList}>
//           <h3>Паллеты</h3>
//           <ul>
//             {boxes.map((item) => (
//               <Fragment key={item.id}>
//                 <li className={styles.containerItem}>
//                   <div className={styles.itemMain}>
//                     <FaPallet className={styles.containerIcon} />
//                     <button
//                       onClick={() => moreInfo(item)}
//                       className={styles.toggleButton}
//                       title={expandedItem === item.id ? 'Скрыть' : 'Показать'}
//                     >
//                       {expandedItem === item.id ? <FaChevronUp /> : <FaChevronDown />}
//                     </button>
//                     <span>{item.label}</span>
//                     <div className={styles.buttons}>
//                       {/* <button
//                         onClick={() => moreInfo(item)}
//                         className={styles.toggleButton}
//                         title={expandedItem === item.id ? 'Скрыть' : 'Показать'}
//                       >
//                         {expandedItem === item.id ? <FaChevronUp /> : <FaChevronDown />}
//                       </button> */}
//                       <button
//                         onClick={() => removeContainer(item.id)}
//                         className={styles.deleteButton}
//                         title="Удалить"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   </div>
//                 </li>

//                 {/* Отдельный блок информации под li */}
//                 {expandedItem === item.id && (
//                   <div className={styles.detailsContainer}>
//                     <div className={styles.itemDetails}>
//                       <h4>Подробности коробки</h4>
//                       <div className={styles.detailsGrid}>
//                         <div className={styles.detailItem}>
//                           <span className={styles.detailLabel}>GTIN:</span>
//                           <span> {currentRes.gtin}</span>
//                         </div>
//                         <div className={styles.detailItem}>
//                           <span className={styles.detailLabel}>Дата создания:</span>
//                           <span>{currentRes.productionDate}</span>
//                         </div>
//                         <div className={styles.detailItem}>
//                           <span className={styles.detailLabel}>Окончание годности:</span>
//                           <span>{currentRes.expiryDate}</span>
//                         </div>
//                         <div className={styles.detailItem}>
//                           <span className={styles.detailLabel}>Партия:</span>
//                           <span>{currentRes.batchNumber}</span>
//                         </div>
//                         <div className={styles.detailItem}>
//                           <span className={styles.detailLabel}>Количество:</span>
//                           <span>{currentRes.quantity}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </Fragment>
//             ))}
//           </ul>
//         </div>
//       )}

//       {containers.length > 0 && (
//         <button onClick={handlePrintReport} className={`action-button ${styles.printButton}`}>
//           Отгрузить
//         </button>
//       )}
//     </div>
//   );
// }

'use client';
import React, { KeyboardEvent, ChangeEvent, useState, useEffect, useRef, Fragment } from 'react';
import styles from '../search.module.css';
import BurgerMenu from '../../BurgerMenu/BurgerMenu';
import useSearchDispatch from '@/app/hooks/useSearchDispatch';
import { parseCodeHelper } from '../parce.helper';
import { FaTrash, FaPallet, FaBox, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { notifyError } from '@/app/API/apiClient';
import Modal from '@/app/components/Modal/Modal';
import { CircleCheckBig } from 'lucide-react';

interface ContainerItem {
  id: string;
  type: 'box' | 'pallet';
  label: string;
  foundTables: string;
}

export interface ContainerData {
  boxes: Array<{ box: string; table: string }>;
  pallets: Array<{ pallet: string; table: string }>;
}

export default function Report() {
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [containers, setContainers] = useState<ContainerItem[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [currentRes, setCurrentRes] = useState<any>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { getCodeSearchGlobalBox, getCodeSearchGlobalPallet, getReportBoxAndPallet } =
    useSearchDispatch();

  // 🔁 Держим постоянный фокус на input
  useEffect(() => {
    const keepFocus = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };
    keepFocus(); // при монтировании
    const interval = setInterval(keepFocus, 500); // периодически возвращаем фокус
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const processBarcode = (rawCode: string): string => {
    const cleanCode = rawCode.replace(/^[\x00-\x1F]+/, '');
    return cleanCode.slice(16);
  };

  const handleSearch = async (code: string) => {
    if (!code || isLoading) return;

    // const isAlreadyAdded = containers.some((item) => item.id === code);
    // if (isAlreadyAdded) {
    //   notifyError(`Код ${code} уже был добавлен ранее`);
    //   return;
    // }

    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const isAlreadyAdded = containers.some((item) => item.id === code);
      if (isAlreadyAdded) {
        notifyError(`Код ${code} уже был добавлен ранее`);
        return;
      }

      const processedCode = processBarcode(code);

      if (processedCode.startsWith('21')) {
        notifyError('Ошибка: получен продукт, а не коробки/паллеты');
      } else {
        const parsedData = parseCodeHelper(code);
        if (parsedData?.containerType === 'box') {
          const response = await getCodeSearchGlobalBox(code);
          if (response?.status === 200) {
            addContainer(code, parsedData, response.foundTables || '');
          } else {
            notifyError(response?.message || 'Ошибка при поиске коробки');
            return;
          }
        }
        if (parsedData?.containerType === 'pallet') {
          const response = await getCodeSearchGlobalPallet(code);
          if (response?.status === 200) {
            addContainer(code, parsedData, response.foundTables || '');
          } else {
            notifyError(response?.message || 'Ошибка при поиске паллеты');
            return;
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Ошибка поиска:', error);
        notifyError('Ошибка при обработке запроса');
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsLoading(false);
      setCurrentInput('');
      // сразу возвращаем фокус (на случай, если интервал ещё не сработал)
      inputRef.current?.focus();
    }
  };

  const addContainer = (code: string, parsedData: any, foundTables: string) => {
    const newContainer: ContainerItem = {
      id: code,
      type: parsedData.containerType,
      label:
        parsedData.containerType === 'box'
          ? `Коробка ${parsedData.containerNumber}`
          : `Паллета ${parsedData.containerNumber}`,
      foundTables,
    };
    setContainers((prev) => [...prev, newContainer]);
  };

  const removeContainer = (id: string) => {
    setContainers((prev) => prev.filter((item) => item.id !== id));
    // опционально возвращаем фокус после клика мышью
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(currentInput.trim());
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const handlePrintReport = async () => {
    const containerData = getContainerData();
    const report = await getReportBoxAndPallet(containerData);

    if (report) {
      setMessage(report);
      setContainers([]);
      handleOpenModal();
    } else {
      console.log('failed');
    }
    inputRef.current?.focus();
  };

  const pallets = containers.filter((item) => item.type === 'pallet');
  const boxes = containers.filter((item) => item.type === 'box');

  const getContainerData = (): ContainerData => {
    const boxData = containers
      .filter((item) => item.type === 'box')
      .map((item) => ({
        box: item.id,
        table: item.foundTables,
      }));

    const palletData = containers
      .filter((item) => item.type === 'pallet')
      .map((item) => ({
        pallet: item.id,
        table: item.foundTables,
      }));

    return {
      boxes: boxData,
      pallets: palletData,
    };
  };

  const moreInfo = (item: any) => {
    const parsedData = parseCodeHelper(item.id);
    setExpandedItem(expandedItem === item.id ? null : item.id);
    setCurrentRes(parsedData);
    inputRef.current?.focus();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className={styles.search}>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        styles={{ width: '400px', background: '#97F241', border: 'none', bottom: '23%' }}
      >
        <h3 style={{ display: 'flex', alignItems: 'end' }}>
          Успешно
          <CircleCheckBig color="#2c2593" size={24} strokeWidth={2} />
        </h3>{' '}
        <br />В отчете {message} кодов продукта.
      </Modal>
      <BurgerMenu />

      {/* Инпут с постоянным фокусом, "как раньше" (Enter ловится onKeyDown) */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Введите штрихкод для отгрузки"
        disabled={isLoading}
        autoFocus
      />

      {isLoading && <div className={styles.loading}>Поиск...</div>}

      {pallets.length > 0 && (
        <div className={styles.containerList}>
          <h3>Паллеты</h3>
          <ul>
            {pallets.map((item) => (
              <Fragment key={item.id}>
                <li className={styles.containerItem}>
                  <div className={styles.itemMain}>
                    <FaPallet className={styles.containerIcon} />
                    <button
                      onClick={() => moreInfo(item)}
                      className={styles.toggleButton}
                      title={expandedItem === item.id ? 'Скрыть' : 'Показать'}
                    >
                      {expandedItem === item.id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    <span>{item.label}</span>
                    <div className={styles.buttons}>
                      <button
                        onClick={() => removeContainer(item.id)}
                        className={styles.deleteButton}
                        title="Удалить"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </li>
                {expandedItem === item.id && (
                  <div className={styles.detailsContainer}>
                    <div className={styles.itemDetails}>
                      <h4>Подробности паллеты</h4>
                      <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>GTIN:</span>
                          <span> {currentRes.gtin}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Дата создания:</span>
                          <span>{currentRes.productionDate}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Окончание годности:</span>
                          <span>{currentRes.expiryDate}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Партия:</span>
                          <span>{currentRes.batchNumber}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Количество:</span>
                          <span>{currentRes.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </ul>
        </div>
      )}

      {boxes.length > 0 && (
        <div className={styles.containerList}>
          <h3>Коробки</h3>
          <ul>
            {boxes.map((item) => (
              <Fragment key={item.id}>
                <li className={styles.containerItem}>
                  <div className={styles.itemMain}>
                    <FaBox className={styles.containerIcon} />
                    <button
                      onClick={() => moreInfo(item)}
                      className={styles.toggleButton}
                      title={expandedItem === item.id ? 'Скрыть' : 'Показать'}
                    >
                      {expandedItem === item.id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    <span>{item.label}</span>
                    <div className={styles.buttons}>
                      <button
                        onClick={() => removeContainer(item.id)}
                        className={styles.deleteButton}
                        title="Удалить"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </li>
                {expandedItem === item.id && (
                  <div className={styles.detailsContainer}>
                    <div className={styles.itemDetails}>
                      <h4>Подробности коробки</h4>
                      <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>GTIN:</span>
                          <span> {currentRes.gtin}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Дата создания:</span>
                          <span>{currentRes.productionDate}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Окончание годности:</span>
                          <span>{currentRes.expiryDate}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Партия:</span>
                          <span>{currentRes.batchNumber}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Количество:</span>
                          <span>{currentRes.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </ul>
        </div>
      )}

      {containers.length > 0 && (
        <button onClick={handlePrintReport} className={`action-button ${styles.printButton}`}>
          Отгрузить
        </button>
      )}
    </div>
  );
}
