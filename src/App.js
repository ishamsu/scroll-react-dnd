import { useEffect, useRef, useCallback, useState } from "react";
import { useDragDropManager } from "react-dnd";
import { useScroll } from "./useScroll";
import { RowCard } from "./Row";
import { Cell, Column, HeaderCell, Table } from "rsuite-table";

const style = {
  width: "100%",
  height: "100%",
  overflow: "scroll",
};

// Generating some random data to feed to the table
function mockUsers(numUsers) {
  const users = [];
  for (let i = 1; i <= numUsers; i++) {
    users.push({
      id: i,
      firstName: `FirstName${i}`,
      lastName: `LastName${i}`,
      email: `user${i}@example.com`,
    });
  }
  return users;
}

const App = () => {
  // This ref is for the conatiner to identify which direction we are scrolling
  const listRef = useRef(null);

  // This ref is used for table reference
  const tableRef = useRef(null);

  const fakeData = mockUsers(100);

  // state to store data used in table
  const [data, setData] = useState(fakeData);

  // Define column with name and width for the table
  const [columns, setColumns] = useState([
    { id: "id", name: "Id", width: 80 },
    { id: "firstName", name: "First Name", width: 200 },
    { id: "lastName", name: "Last Name", width: 200 },
    { id: "email", name: "Email", width: 300, flexGrow: 1 },
  ]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {}, []);

  // Retrieve the custom hook for managing scroll behavior
  const { updatePosition } = useScroll(listRef, tableRef);

  // Access the drag-and-drop manager and monitor from react-dnd
  const dragDropManager = useDragDropManager();
  const monitor = dragDropManager.getMonitor();

  // Effect hook to handle scroll updates based on drag events
  useEffect(() => {
    // Subscribe to changes in the drag offset
    const unsubscribe = monitor.subscribeToOffsetChange(() => {
      // Get the current vertical offset of the dragged item on y axis
      const offset = monitor.getSourceClientOffset()?.y;

      console.log(
        "Scroll position of Y axis ..........",
        monitor.getSourceClientOffset()
      );

      // Update the scroll position and allow scrolling if needed
      updatePosition({ position: offset, isScrollAllowed: true });
    });

    // Cleanup the subscription when the component unmounts or dependencies change
    return unsubscribe;
  }, [monitor, updatePosition]);

  return (
    <>
      <div style={{ height: "100px" }}></div>
      <div style={{ height: "100vh" }}>
        <div style={{ height: "93.6%" }}>
          <div ref={listRef} style={style}>
            <Table
              ref={tableRef}
              fillHeight
              data={data}
              bordered
              rowKey="id"
              renderRow={(children, rowData) => {
                return rowData ? (
                  <RowCard
                    index={rowData.id}
                    rowData={rowData}
                    id={rowData.id}
                    moveCard={moveCard}
                  >
                    {children}
                  </RowCard>
                ) : (
                  children
                );
              }}
            >
              {columns.map((column) => (
                <Column
                  width={column.width}
                  key={column.id}
                  flexGrow={column?.flexGrow}
                >
                  <HeaderCell id={column.id} style={{ padding: 0 }}>
                    <div
                      style={{
                        padding: "0.6rem 1rem",
                        cursor: "grab",
                        opacity: 1,
                        borderLeft: "2px solid #2589f5",
                        backgroundColor: "gray",
                      }}
                    >
                      {column.name}
                    </div>
                  </HeaderCell>
                  <Cell dataKey={column.id} />
                </Column>
              ))}
            </Table>
          </div>
        </div>
      </div>
      <div style={{ height: "100px" }}></div>
    </>
  );
};

export default App;
