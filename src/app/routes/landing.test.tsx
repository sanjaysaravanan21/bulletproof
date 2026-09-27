import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

import LandingRoute from './landing';

test('shows and dismisses the welcome modal', async () => {
  await renderApp(<LandingRoute />, { user: null });

  expect(
    await screen.findByRole('heading', {
      name: 'Welcome to the Application!!!',
    }),
  ).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Ok' }));

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
  );
});