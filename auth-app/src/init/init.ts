import { PrismaClient } from '.prisma/client';
import { AuthService } from '@core/services/auth/auth.service';
import { AuthController } from '@api/auth/auth.controller';
import { AuthRepository } from '@core/services/repositories/auth/auth.repository';

function initialiseServices() {
  const prismaClient = new PrismaClient();
  const authRepository = new AuthRepository(prismaClient);
  const authService = new AuthService(authRepository);
  const authController = new AuthController(
    authService,
  );

  return { authController };
}

export { initialiseServices };
