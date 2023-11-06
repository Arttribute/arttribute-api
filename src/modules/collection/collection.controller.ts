import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User, UserPayload } from '../auth';
import { Project, Authentication } from '../auth/decorators';
import { CollectionResponse, CreateCollection } from './collection.dto';
import { CollectionService } from './collection.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('collections')
@ApiBearerAuth()
@Controller({ version: '1', path: 'collections' })
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @ApiOperation({ summary: 'Create a new collection' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new collection',
    type: CollectionResponse,
  })
  @Authentication('any')
  @Post()
  async createCollection(
    @Body() createCollectionDto: CreateCollection,
    @User() user: UserPayload,
    @Project() project: any,
  ) {
    return await this.collectionService.createCollection(
      createCollectionDto,
      user,
      project,
    );
  }

  @ApiOperation({ summary: 'Get all collections' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all collections',
    type: [CollectionResponse],
  })
  @ApiResponse({ status: 404, description: 'No Collection found' })
  @Get()
  async getAllCollections() {
    return await this.collectionService.getAllCollections();
  }

  @ApiOperation({ summary: 'Get all collections for a user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all collections for a user',
    type: [CollectionResponse],
  })
  @ApiResponse({ status: 404, description: 'No collection found for user' })
  @Get('user/:id') // TODO: change when user feature and auth is implemented [expected: /users/{userId}/collections)]
  async getCollectionsForUser(@Param('id') userId: string) {
    return await this.collectionService.getCollectionsForUser(userId);
  }

  @ApiOperation({ summary: 'Get a collection' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved a collection',
    type: CollectionResponse,
  })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  @Get(':id')
  async getCollection(@Param('id') collectionId: string) {
    return await this.collectionService.getCollection(collectionId);
  }

  @ApiOperation({ summary: 'Change the visibility of a collection' })
  @ApiResponse({
    status: 200,
    description: 'Successfully changed the visibility of a collection',
    type: CollectionResponse,
  })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  @ApiResponse({ status: 401, description: 'Forbidden' })
  @Authentication('jwt')
  @Patch(':id')
  async changeVisibility(
    @Param('id') collectionId: string,
    @Body('isPublic') isPublic: boolean,
    @User() user: UserPayload,
  ) {
    return await this.collectionService.changeVisibility(
      collectionId,
      isPublic,
      user,
    );
  }

  // TODO: check on the API structure for adding and removing items from a collection
  @ApiOperation({ summary: 'Add an item to a collection' })
  @ApiResponse({
    status: 200,
    description: 'Successfully added an item collection',
    type: [CollectionResponse],
  })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  @ApiResponse({ status: 401, description: 'Forbidden' })
  @Authentication('jwt')
  @Patch(':id/items')
  async addItemToCollection(
    @Param('id') collectionId: string,
    @Body('itemId') itemId: string,
    @User() user: UserPayload,
  ) {
    return await this.collectionService.addItemToCollection(
      collectionId,
      itemId,
      user,
    );
  }

  @ApiOperation({ summary: 'Remove an item from a collection' })
  @ApiResponse({
    status: 200,
    description: 'Successfully removed an item from the collection',
    type: [CollectionResponse],
  })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  @ApiResponse({ status: 401, description: 'Forbidden' })
  @Authentication('jwt')
  @Delete(':id/items/:itemId')
  async removeItemFromCollection(
    @Param('id') collectionId: string,
    @Param('itemId') itemId: string,
    @User() user: UserPayload,
  ) {
    return await this.collectionService.removeItemFromCollection(
      collectionId,
      itemId,
      user,
    );
  }

  @ApiOperation({ summary: 'Delete a collection' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted a collection',
  })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  @ApiResponse({ status: 401, description: 'Forbidden' })
  @Authentication('jwt')
  @Delete(':id')
  async deleteCollection(
    @Param('id') collectionId: string,
    @User() user: UserPayload,
  ) {
    return await this.collectionService.deleteCollection(collectionId, user);
  }
}
