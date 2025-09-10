// import { useSelector } from "react-redux";
// import { useTable } from 'react-table';
// import { useMemo } from "react";
// import { columns } from './columns';
// import { getTableData } from './data';
// import { RootState } from "../../../../store/store";

// const TaskFileContent = () => {
//   const { selectedFileContent } = useSelector((state: RootState) => state.taskJson);
//   const { selectedAllFileContent } = useSelector((state: RootState) => state.oldSorting);
//   const { isSorting, isPause, isOldMonitoring } = useSelector((state: RootState) => state.monitoring);

//   const tableData = useMemo(() => {
//     if (isOldMonitoring) {
//       return getTableData(selectedAllFileContent);
//     } else {
//       return getTableData(selectedFileContent);
//     }
//   }, [selectedFileContent, selectedAllFileContent, isOldMonitoring]);

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow
//   } = useTable({ columns, data: tableData });

//   if (!selectedFileContent && !selectedAllFileContent) {
//     return <div>Нет данных для отображения</div>;
//   }

//   return (
//     <table {...getTableProps()}>
//       <thead>
//         <tr key="header-row-0">
//           <th colSpan={2}>Данные файла</th>
//         </tr>
//         {headerGroups.map(headerGroup => (
//           <tr {...headerGroup.getHeaderGroupProps()} key={`header-group-${headerGroup.id}`}>
//             {headerGroup.headers.map(column => (
//               <th {...column.getHeaderProps()} key={`header-${column.id}`}>
//                 {column.render('Header')}
//               </th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody {...getTableBodyProps()}>
//         {rows.map((row, i) => {
//           prepareRow(row);
//           return (
//             <tr {...row.getRowProps()} key={`row-${row.id}-${i}`}>
//               {row.cells.map(cell => (
//                 <td {...cell.getCellProps()} key={`cell-${cell.row.id}-${cell.column.id}`}>
//                   {cell.render('Cell')}
//                 </td>
//               ))}
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// };

// export default TaskFileContent;
