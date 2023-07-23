
import * as React from "react"
import ProductAddToCart from "../components/ProductAddToCart";
import { Flex } from "@chakra-ui/react";

function ProductGrid() {

    const groups = [
        {
          isNew: true,
          imageURL:
            'https://images.cointelegraph.com/images/717_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS9zdG9yYWdlL3VwbG9hZHMvdmlldy8xNjQ1ODZiZjViYzBlMmFkNGUxMDM1NDVlM2Y0NjAxMi5qcGc=.jpg',
          name: 'Ape Community',
          price: 450,
          rating: 4.2,
          numReviews: 34,
        },
        // ...other groups
      ];
      
    return (
      <Flex wrap="wrap" justifyContent="space-around">
        {groups.map((group, index) => (
          <ProductAddToCart key={index} data={group} />
        ))}
      </Flex>
    );
  }
  
  export default ProductGrid;
  
 