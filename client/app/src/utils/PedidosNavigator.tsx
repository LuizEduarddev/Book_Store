import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Pedidos from "../cliente_side/PedidosPage/Pedidos";

const PedidosStack = createNativeStackNavigator();

function PedidosNavigator() {
  return (
    <PedidosStack.Navigator>
      <PedidosStack.Screen 
        name="PedidosList" 
        component={Pedidos} 
        options={{ headerShown: false }} 
      />
    </PedidosStack.Navigator>
  );
}

export default PedidosNavigator;
