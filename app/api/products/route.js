
let products = [
  {
    id: 1,
    name: 'Mountain Bike',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPCE1Gk1_0hLXFQqvzrkk3l2HKbrV_jGdFVRrGijCgrg&s=10',
    price: 450,
    category: 'Bikes',
  },
  {
    id: 2,
    name: 'Electric Scooter',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKr0El6neLG0Wi7Q0HRhAPvgvFHwPXb74PtKtK2AKtMg&s=10',
    price: 350,
    category: 'Scooters',
  },
  {
    id: 3,
    name: 'Street Skateboard',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiH-8KC_RbpInK-CpJunJkk7nP-xTACOWSFKafljIArw&s=10',
    price: 80,
    category: 'Skateboards',
  },
];

export async function GET() {
  return Response.json(products);
}

export async function POST(req) {
  const data = await req.json();

  const newProduct = {
    ...data,
    id: Date.now(),
    price: Number(data.price),
  };

  products.push(newProduct);

  return Response.json(newProduct, { status: 201 });
}

export async function DELETE(req) {
  const { id } = await req.json();

  const exists = products.some(
    (product) => product.id === Number(id)
  );

  if (!exists) {
    return Response.json(
      { message: 'Product not found' },
      { status: 404 }
    );
  }

  products = products.filter(
    (product) => product.id !== Number(id)
  );

  return Response.json({
    message: 'Product Deleted Successfully',
  });
}

export async function PATCH(req) {
  const { id, ...updates } = await req.json();

  const product = products.find(
    (product) => product.id === Number(id)
  );

  if (!product) {
    return Response.json(
      { message: 'Product not found' },
      { status: 404 }
    );
  }

  if (updates.price !== undefined) {
    updates.price = Number(updates.price);
  }

  Object.assign(product, updates);

  return Response.json(product);
}
