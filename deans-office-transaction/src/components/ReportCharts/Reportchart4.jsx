import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

function Reportchart4() {
  const [valueCounts, setValueCounts] = useState({});
  const [highestValue, setHighestValue] = useState('');
  const [highestCount, setHighestCount] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'documents'), where("Remark", "!=", "Archive")));
        
        const counts = {};
        querySnapshot.forEach((doc) => {
          const fieldValue = doc.data().from;
          if (counts[fieldValue]) {
            counts[fieldValue]++;
          } else {
            counts[fieldValue] = 1;
          }
        });

        let maxCount = 0;
        let maxValue = '';
        
        for (const [value, count] of Object.entries(counts)) {
          if (count > maxCount) {
            maxCount = count;
            maxValue = value;
          }
        }

        delete counts[maxValue];

        setHighestValue(maxValue);
        setHighestCount(maxCount);
        setValueCounts(counts);

      } catch (error) {
        console.error('Error fetching and counting documents:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="rep-Collegelist">
      <h3>College Department</h3>
      <ul>
        <li>
          <span className="coll-name main">{highestValue}</span>
          <span class="total-placeholder main">{"Total: " + highestCount}</span>
        </li>
        {Object.entries(valueCounts).sort((a, b) => b[1] - a[1]).map(([value, count]) => (
          <li key={value}>
            <span className="coll-name">{value}</span>
            <span class="total-placeholder">{"Total: " + count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reportchart4;
