import { createDish } from './src/actions/dish-actions';

async function test() {
  const formData = new FormData();
  formData.append('name', 'Test Dish');
  formData.append('description', 'Test Description');
  formData.append('price', '10.0');
  formData.append('category_id', '11111111-1111-1111-1111-111111111111');
  formData.append('is_available', 'true');
  formData.append('sort_order', '0');
  
  // Create a dummy text file
  const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
  formData.append('image', file);

  try {
    const result = await createDish({ success: false }, formData);
    console.log("Result:", result);
  } catch (err) {
    console.error("Caught Exception:", err);
  }
}
test();
