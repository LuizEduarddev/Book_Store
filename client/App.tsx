import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/src/cliente_side/LoginPage/Login";
import Home from "./app/src/cliente_side/HomePage/Home"; 
import { ToastProvider } from "react-native-toast-notifications";
import Register from "./app/src/cliente_side/RegisterUser/Register";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Products from "./app/src/cliente_side/ProductsPage/Products";
import Pedidos from "./app/src/cliente_side/PedidosPage/Pedidos";
import LivroDetails from "./app/src/cliente_side/HomePage/LivroDetails";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="TabHome"
        component={Home}
        options={{ headerShown: false }} 
      />
      <Tab.Screen
        name="Products"
        component={Products}
        options={{ headerShown: false }} 
      />
      <Tab.Screen
        name="Pedidos"
        component={Pedidos}
        options={{ headerShown: false }}
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
          <Stack.Screen name="LivroDetails" component={LivroDetails} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}
