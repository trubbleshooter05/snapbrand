import { prisma } from './prisma'

export async function getUserWithStats(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      generationsUsed: true,
      isProMember: true,
      generatedAssets: true,
    },
  })
}

export async function incrementGenerationCount(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { generationsUsed: { increment: 1 } },
  })
}

export async function createGeneratedAsset(
  userId: string,
  brandName: string,
  assetType: string,
  imageUrl: string,
  promptUsed: string
) {
  return await prisma.generatedAsset.create({
    data: {
      userId,
      brandName,
      assetType,
      imageUrl,
      promptUsed,
    },
  })
}

export async function getUserAssets(userId: string) {
  return await prisma.generatedAsset.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateUserProStatus(userId: string, isProMember: boolean) {
  return await prisma.user.update({
    where: { id: userId },
    data: { isProMember },
  })
}

export async function updateStripeInfo(
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string
) {
  return await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId, stripeSubscriptionId },
  })
}
