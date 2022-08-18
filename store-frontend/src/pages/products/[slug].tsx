import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    CardHeader,
  } from "@material-ui/core";
  import { GetStaticPaths, GetStaticProps, NextPage } from "next";
  import Head from "next/head";
  import { useRouter } from "next/router";
  import http from "../../http";
  import { Product } from "../../model";
  
  interface ProductDetailPageProps {
    product: Product;
  }
  
  const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product }) => {
    const router = useRouter();
  
    if(router.isFallback){
      return <div>Carregando...</div>;
    }
    return (
      <div>
        <Head>
          <title>{product.name} - Detalhes do produto</title>
        </Head>
        <Card>
          <CardHeader
            title={product.name.toUpperCase()}
            subheader={`R$ ${product.price}`}
          />
          <CardActions>
            <Button size="small" color="primary" component="a">
              Comprar
            </Button>
          </CardActions>
          <CardMedia style={{ paddingTop: "56%" }} image={product.image_url} />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {product.description}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default ProductDetailPage;
  
  export const getStaticProps: GetStaticProps<
    ProductDetailPageProps,
    { slug: string }
  > = async (context) => {
    const { slug } = context.params!;
    const { data: product } = await http.get(`products/${slug}`);
    console.log(product);
    return {
      props: {
        product,
      },
    };
  };
  
  export const getStaticPaths: GetStaticPaths = async (context) => {
    const { data: products } = await http.get(`products`);
  
    const paths = products.map((p: Product) => ({
      params: {slug: p.slug},
    }));
    
    return { paths, fallback: 'blocking' };
  };
  