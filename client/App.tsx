import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/src/LoginPage/Login";
import Home from "./app/src/cliente_side/HomePage/Home"; 
import { ToastProvider } from "react-native-toast-notifications";
import Register from "./app/src/cliente_side/RegisterUser/Register";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Pedidos from "./app/src/cliente_side/PedidosPage/Pedidos";
import LivroDetails from "./app/src/cliente_side/HomePage/LivroDetails";
import Carrinho from "./app/src/cliente_side/CarrinhoPage/Carrinho";
import Icon from 'react-native-ico-shopping';
import FontAwesone from 'react-native-vector-icons/FontAwesome6';
import HomeAdmin from "./app/src/admin_side/home_admin/HomeAdmin";
import PedidosNavigator from "./app/src/utils/PedidosNavigator";
import DetailsPedido from "./app/src/cliente_side/PedidosPage/DetailsPedido";
import DetailsLivroVendido from "./app/src/admin_side/home_admin/DetailsLivroVendido";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="TabHome"
        component={Home}
        options={{ 
          headerShown: false,
          tabBarIcon: (tabInfo) => {
            return(
              <FontAwesone name="house" size={25}/>
            );
          }
        }} 
      />
      <Tab.Screen
        name="Carrinho"
        component={Carrinho}
        options={{ 
          headerShown: false,
          tabBarIcon: (tabInfo) => {
            return(
              <Icon name="shopping-cart" height="25" width="25" />
            );
          }
        }} 
      />
      <Tab.Screen
        name="Pedidos"
        component={PedidosNavigator}
        options={{ 
          headerShown: false,
          tabBarIcon: (tabInfo) => {
            return(
              <FontAwesone name="dolly" size={25}/>
            );
          }
        }} 
      />
    </Tab.Navigator>
  );
}

function BottomTabNavigatorAdmin() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={HomeAdmin}
        options={{ 
          headerShown: false,
          tabBarIcon: (tabInfo) => {
            return(
              <FontAwesone name="house" size={25}/>
            );
          }
        }} 
      />
      <Tab.Screen
        name="não clicar"
        component={Carrinho}
        options={{ 
          headerShown: false,
          tabBarIcon: (tabInfo) => {
            return(
              <Icon name="shopping-cart" height="25" width="25" />
            );
          }
        }} 
      />
      <Tab.Screen
        name="não clicar pf"
        component={Pedidos}
        options={{ 
          headerShown: false,
          tabBarIcon: (tabInfo) => {
            return(
              <FontAwesone name="dolly" size={25}/>
            );
          }
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="HomeAdmin" component={BottomTabNavigatorAdmin} options={{ headerShown: false }} />
          <Stack.Screen name="LivroDetails" component={LivroDetails} options={{ headerShown: false }} />
          <Stack.Screen name="PedidoDetails" component={DetailsPedido} options={{ headerShown: false }} />
          <Stack.Screen name="LivroVendidoDetails" component={DetailsLivroVendido} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}
