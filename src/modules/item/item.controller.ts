import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User, UserPayload } from '../auth';
import { Authentication, Project } from '../auth/decorators';
import { UserService } from '../user/user.service';
import { CreateItemDto, ItemResponse, UpdateItemDto } from './item.dto';
import { ItemService } from './item.service';

@ApiBearerAuth()
@ApiTags('items')
@Authentication('any')
@Controller({ version: '1', path: 'items' })
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all items',
    type: [ItemResponse],
  })
  @Get()
  findAll(
    @Query()
    query: {
      source?: string;
      tags?: string;
    },
  ) {
    return this.itemService.findAll(query);
  }

  @ApiOperation({ summary: 'Get item by id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved item',
    type: ItemResponse,
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @User() user?: UserPayload,
    @Project() project?: any,
  ) {
    user ||= await this.userService.populateUser(project);
    return this.itemService.findOne(id);
  }

  // DEPRECATED
  // // @Post('fileupload')
  // // @UseInterceptors(FileInterceptor('file'))
  // // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  // //   return this.itemService.uploadToWeb3Storage(file);
  // // }

  /************** -------- Not in use anymore ---------**************/
  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // async create(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [new MaxFileSizeValidator({ maxSize: 10000000 })],
  //     }),
  //   )
  //   file: Express.Multer.File,
  //   @Body() createItem: CreateItemDto, //TODO: Should currency input be limited in array?
  //   @User() user: UserPayload,
  //   @Project() project: any,
  // ) {
  //   console.log(user);
  //   return this.itemService.create(file, createItem, user, project);
  // }
  /************** -------- Not in use anymore ---------**************/

  @ApiOperation({ summary: 'Create an item' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created an item',
    type: ItemResponse,
  })
  @ApiResponse({ status: 401, description: 'Forbidden' })
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    type: CreateItemDto,
  })
  async create(
    @Body() createItem: CreateItemDto, //TODO: Should currency input be limited in array?
    @User() user?: UserPayload,
    @Project() project?: any,
  ) {
    user ||= await this.userService.populateUser(project);
    return this.itemService.create(createItem, user, project);
  }

  @ApiOperation({ summary: 'Update an item' })
  @ApiResponse({
    status: 204,
    description: 'Successfully updated an item',
    type: ItemResponse,
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 401, description: 'Forbidden' })
  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() updateItem: UpdateItemDto,
    @User() user?: UserPayload,
    @Project() project?: any,
  ) {
    user ||= await this.userService.populateUser(project);
    return this.itemService.update(id, updateItem, user, project);
  }

  @ApiOperation({ summary: 'Delete an item' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted an item',
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 401, description: 'Forbidden' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @User() user?: UserPayload,
    @Project() project?: any,
  ) {
    user ||= await this.userService.populateUser(project);
    return this.itemService.remove(id, user);
  }
}
