import React, { useState } from 'react';

function App() {

  const [loading, setLoading] = useState(false);

  const handleCalculateAveragePrice = async () => {
    setLoading(true);

    try {
      const categoriesResponse = await fetch('https://test.teaching-me.org/categories/v1/open/categories', {
        headers: {
          'Accept-Language': 'en'
        }
      });
      const categoriesData = await categoriesResponse.json();
      const categories = categoriesData;
      // console.log('categories', categories)
  
      for (const category of categories) {
        const teachersResponse = await fetch('https://test.teaching-me.org/categories/v1/open/search', {
          method: 'POST',
          headers: {
            'Accept-Language': 'en',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            categories: [category.code],
            page: 0,
            pageSize: 10
          })
        });
        const teachersData = await teachersResponse.json();
        const teachers = teachersData.teachers;
        console.log('teachers', teachers)
        let total = 0;
        for (const teacher of teachers) {
          total += teacher.pricePerHour;
        }

        const averagePrice = total / teachers.length;


        await fetch('https://test.teaching-me.org/categories/v1/open/average-price', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            categoryName: category.name,
            averagePrice: averagePrice
          })
        });
      }

      alert('sAverage prices calculated and posted successfully!');
    } catch (error) {
      console.error('Error calculating average prices:', error);
      alert('Error calculating average prices. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='calculate_wrapper'>
      {
        loading ? 
        <img src='./Loader.gif' alt='loader' className='calculate_img'></img>
        :
        <button onClick={handleCalculateAveragePrice} disabled={loading} className='calculate_btn'>
           Calculate average price
        </button>
      }

    </div>
  );
}

export default App;
