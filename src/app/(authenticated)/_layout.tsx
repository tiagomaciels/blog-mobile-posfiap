import { Stack } from 'expo-router';

import { AdminHeaderRight } from '@/components/admin/admin-header-right';
import { HomeHeaderRight } from '@/components/home/home-header-right';
import { HomeHeaderTitle } from '@/components/home/home-header-title';

export default function AuthenticatedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: 'default',
        headerBackButtonMenuEnabled: true,
        headerBackTitle: 'Voltar',
      }}
      initialRouteName="home"
    >
      <Stack.Screen
        name="home"
        options={{
          headerTitle: () => <HomeHeaderTitle />,
          headerRight: () => <HomeHeaderRight />,
        }}
      />
      <Stack.Screen
        name="admin"
        options={{
          title: 'Painel Administrativo',
          headerRight: () => <AdminHeaderRight />,
        }}
      />
      <Stack.Screen
        name="post/[id]"
        options={{
          title: 'Post',
        }}
      />
      <Stack.Screen
        name="post/create-post"
        options={{
          title: 'Novo post',
        }}
      />
      <Stack.Screen
        name="post/edit-post/[id]"
        options={{
          title: 'Editar post',
        }}
      />
    </Stack>
  );
}
