import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  CardHeader,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@material-ui/core";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import http from "../../../http";
import { Product } from "../../../model";

interface OrderPageProps {
  product: Product;
}

const OrderPage: NextPage<OrderPageProps> = ({ product }) => {
  return (
    <div>
      <Head>
        <title>Pagamento</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Checkout
      </Typography>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={product.image_url} />
        </ListItemAvatar>
        <ListItemText
          primary={product.name}
          secondary={`R$ ${product.price}`}
        />
      </ListItem>
    </div>
  );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps<
OrderPageProps,
  { slug: string }
> = async (context) => {
  const { slug } = context.params!;
  try {
    const { data: product } = await http.get(`products/${slug}`);
    console.log(product);
    
    return {
      props: {
        product,
      },
      revalidate: 1 * 60 * 2,
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return { notFound: true };
    }
    throw e;
  }
};
