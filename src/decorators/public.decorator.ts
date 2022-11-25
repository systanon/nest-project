import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { PUBLIC } from 'src/constants';

export const Public = (): CustomDecorator<string> => SetMetadata(PUBLIC, true);
