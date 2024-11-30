import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/src/LoginPage/Login";
import Home from "./app/src/cliente_side/HomePage/Home"; 
import { ToastProvider } from "react-native-toast-notifications";
import Register from "./app/src/cliente_side/RegisterUser/Register";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LivroDetails from "./app/src/cliente_side/HomePage/LivroDetails";
import Carrinho from "./app/src/cliente_side/CarrinhoPage/Carrinho";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'; 
import HomeAdmin from "./app/src/admin_side/home_admin/HomeAdmin";
import PedidosNavigator from "./app/src/utils/PedidosNavigator";
import DetailsPedido from "./app/src/cliente_side/PedidosPage/DetailsPedido";
import DetailsLivroVendido from "./app/src/admin_side/home_admin/DetailsLivroVendido";
import EstoqueLivros from "./app/src/admin_side/Estoque/EstoqueLivros";
import EditLivro from "./app/src/admin_side/Estoque/EditLivro";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CriarLivro from "./app/src/admin_side/Estoque/CriarLivro";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

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
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="home" size={25} color={'orange'} />
          ),
          tabBarLabel: 'Home', 
        }}
      />

      <Tab.Screen
        name="Carrinho"
        component={Carrinho}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart" size={30} color={'orange'} />
          ),
          tabBarLabel: 'Cart', 
        }}
      />

      <Tab.Screen
        name="Pedidos"
        component={PedidosNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="gift" size={30} color={'orange'} />  
          ),
          tabBarLabel: 'Orders', 
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
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="chart-bar" size={25} color="orange" /> 
          ),
        }}
      />
      <Tab.Screen
        name="Estoque"
        component={EstoqueLivros}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="inventory" size={25} color="orange" /> 
          ),
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
          <Stack.Screen name="Estoque" component={EstoqueLivros} options={{ headerShown: false }} />
          <Stack.Screen name="EditLivro" component={EditLivro} options={{ headerShown: false }} />
          <Stack.Screen name="CriarLivro" component={CriarLivro} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}
