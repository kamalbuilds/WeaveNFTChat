
import * as React from "react"
import ProductAddToCart from "../components/ProductAddToCart";
import { Flex } from "@chakra-ui/react";

function ProductGrid() {

    const groups = [
        {
          isNew: true,
          imageURL:
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=4600&q=80',
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
  
 